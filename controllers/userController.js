import { User } from '../models/User.js';
import PersonCourt from '../models/Person_Court.js';
import Match from '../models/Match.js';

class UserController {
  static getUsers = async (req, res) => {
    try {
      const { id, swipe } = req.query;

      if (id) {
        const user = await User.findById(id)
          .populate({
            path: 'person_id',
            populate: {
              path: 'genre',
            },
          })
          .select('-image -password');
        if (!user) {
          return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        return res.status(200).json({
          msg: 'Usuario obtenido con éxito',
          data: user,
        });
      } else {
        let users = await User.find()
          .populate({
            path: 'person_id',
            populate: {
              path: 'genre',
            },
          })
          .select('-image -password');
        if (users.length <= 0) {
          return res.status(404).json({ msg: 'No se encontraron usuarios' });
        }

        if (swipe) {
          const swipeUser = await User.findById(swipe).select(
            '-image -password',
          );
          if (!swipeUser) {
            return res
              .status(404)
              .json({ msg: 'Usuario de swipe no encontrado' });
          }

          const preferredGenre = swipeUser.person_id.preferred_genre;
          const experience = swipeUser.person_id.experience;

          if (preferredGenre) {
            users = users.filter((user) => {
              return user.person_id.genre.equals(preferredGenre);
            });
          }

          users = users.filter((user) => user._id.toString() !== swipe);

          const swipeUserCourts = await PersonCourt.find({
            person_id: swipeUser.person_id._id,
          }).select('court_id');

          const usersWithCourts = await Promise.all(
            users.map(async (user) => {
              const userCourts = await PersonCourt.find({
                person_id: user.person_id._id,
              }).select('court_id');
              return { user, userCourts };
            }),
          );

          usersWithCourts.sort((a, b) => {
            const commonCourtsA = a.userCourts.filter((court) =>
              swipeUserCourts.some((swipeCourt) =>
                swipeCourt.court_id.equals(court.court_id),
              ),
            ).length;
            const commonCourtsB = b.userCourts.filter((court) =>
              swipeUserCourts.some((swipeCourt) =>
                swipeCourt.court_id.equals(court.court_id),
              ),
            ).length;

            const experienceDiffA = Math.abs(
              a.user.person_id.experience - experience,
            );
            const experienceDiffB = Math.abs(
              b.user.person_id.experience - experience,
            );

            if (commonCourtsA !== commonCourtsB) {
              return commonCourtsB - commonCourtsA;
            }

            if (experienceDiffA !== experienceDiffB) {
              return experienceDiffA - experienceDiffB;
            }

            return a.user.person_id.name.localeCompare(b.user.person_id.name);
          });

          users = usersWithCourts.map((item) => item.user);

          const acceptedMatches = await Match.find({
            $or: [
              { source_user: swipe, status_match: 'accepted' },
              { target_user: swipe, status_match: 'accepted' },
            ],
          });

          const acceptedUserIds = new Set();
          acceptedMatches.forEach((match) => {
            if (match.source_user.toString() === swipe) {
              acceptedUserIds.add(match.target_user.toString());
            } else {
              acceptedUserIds.add(match.source_user.toString());
            }
          });

          users = users.filter(
            (user) => !acceptedUserIds.has(user._id.toString()),
          );

          const pendingMatches = await Match.find({
            $or: [
              { source_user: swipe, status_match: 'pending' },
              { target_user: swipe, status_match: 'pending' },
            ],
          }).populate('source_user target_user');

          const pendingUserIds = new Set([
            ...pendingMatches.map((match) => match.target_user._id.toString()),
            ...pendingMatches.map((match) => match.source_user._id.toString()),
          ]);

          const pendingMatchMap = new Map();
          pendingMatches.forEach((match) => {
            pendingMatchMap.set(
              match.target_user._id.toString(),
              match._id.toString(),
            );
            pendingMatchMap.set(
              match.source_user._id.toString(),
              match._id.toString(),
            );
          });

          users = users.map((user) => {
            const userObj = user.toObject();
            if (pendingUserIds.has(user._id.toString())) {
              userObj.match_id = pendingMatchMap.get(user._id.toString());
            }
            return userObj;
          });

          users.sort((a, b) => {
            const aIsPending = pendingUserIds.has(a._id.toString());
            const bIsPending = pendingUserIds.has(b._id.toString());

            if (aIsPending && !bIsPending) {
              return -1;
            }
            if (!aIsPending && bIsPending) {
              return 1;
            }
            return 0;
          });

          const rejectedMatches = await Match.find({
            $or: [
              { source_user: swipe, status_match: 'rejected' },
              { target_user: swipe, status_match: 'rejected' },
            ],
          });

          const rejectedUserIds = new Set();
          rejectedMatches.forEach((match) => {
            if (match.source_user.toString() === swipe) {
              rejectedUserIds.add(match.target_user.toString());
            } else {
              rejectedUserIds.add(match.source_user.toString());
            }
          });

          users = users.filter(
            (user) => !rejectedUserIds.has(user._id.toString()),
          );
        }

        return res.status(200).json({
          msg: 'Usuarios obtenidos con éxito',
          data: users,
        });
      }
    } catch (error) {
      res.status(400).json({
        msg: 'Error al obtener usuarios',
        error: error.message,
      });
    }
  };
  static createUser = async (req, res) => {
    try {
      const {
        username,
        password,
        name,
        lastname,
        email,
        genre,
        experience,
        preferred_genre,
      } = req.body;

      const image = req.file
        ? { data: req.file?.buffer, contentType: req.file?.mimetype }
        : undefined;

      const result = await User.createPersonAndUser({
        username,
        password,
        name,
        lastname,
        email,
        genre,
        experience,
        preferred_genre,
        image,
      });

      const { data, msg } = result;

      res.status(201).json({
        msg,
        data,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al crear usuario',
        error: error.message,
      });
    }
  };

  static updateUser = async (req, res) => {
    try {
      const { id, username, password, status } = req.body;
      const image = {
        data: req.file?.buffer,
        contentType: req.file?.mimetype,
      };

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, password, image, status },
        {
          new: true,
        },
      );

      if (!updatedUser) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
      }

      const updateObject = updatedUser.toObject();
      delete updateObject.image;
      delete updateObject.password;

      res.status(200).json({
        msg: 'Usuario actualizado con éxito',
        data: updateObject,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al actualizar usuario',
        error: error.message,
      });
    }
  };

  static deleteUser = async (req, res) => {
    try {
      const { id } = req.query;
      const ids = Array.isArray(id) ? id : [id];

      const updatedUsers = await User.updateMany(
        { _id: { $in: ids } },
        { $set: { status: false } },
      );

      if (updatedUsers.matchedCount === 0) {
        return res
          .status(404)
          .json({ msg: 'No se encontraron usuarios para actualizar' });
      }

      res.status(200).json({
        msg: 'Usuarios actualizados con éxito',
        data: updatedUsers,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al actualizar usuarios',
        error: error.message,
      });
    }
  };

  static getUserImage = async (req, res) => {
    try {
      const { id } = req.query;
      const user = await User.findById(id);

      if (!user || !user.image) {
        return res.status(404).json({ msg: 'Imagen no encontrada' });
      }

      res.set('Content-Type', user.image.contentType);
      res.send(user.image.data);
    } catch (error) {
      res.status(400).json({
        msg: 'Error al obtener imagen',
        error: error.message,
      });
    }
  };
}

export default UserController;
