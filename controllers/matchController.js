import Match from '../models/Match.js';

class MatchController {
  static getMatch = async (req, res) => {
    try {
      const { target_user, source_user, status } = req.query;

      if (!target_user && !source_user) {
        return res.status(400).json({
          msg: 'target_user o source_user son requeridos para realizar la búsqueda',
        });
      }

      if (target_user && source_user) {
        return res
          .status(400)
          .json({ msg: 'target_user y source_user no pueden estar juntos' });
      }

      const query = {};
      if (target_user) {
        query.target_user = target_user;
      }
      if (source_user) {
        query.source_user = source_user;
      }
      if (status) {
        query.status_match = status;
      }

      const match = await Match.find(query).populate('target_user source_user');
      if (!match || match.length === 0) {
        return res.status(404).json({ msg: 'Match no encontrado' });
      }

      res.status(200).json({
        msg: 'Match obtenido con éxito',
        data: match,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al obtener match',
        error: error.message,
      });
    }
  };

  static addMatch = async (req, res) => {
    try {
      const socketServer = req.app.get('socketServer');
      const { source_user, target_user, seen, status_match } = req.body;

      if (!source_user || !target_user) {
        return res
          .status(400)
          .json({ msg: 'source_user y target_user son requeridos' });
      }

      const newMatch = new Match({
        source_user,
        target_user,
        seen,
        status_match,
      });

      await newMatch.save();

      const populatedMatch = await newMatch.populate({
        path: 'source_user',
        select: '-image -password',
      });

      socketServer.emitMatchEvent(target_user, populatedMatch);

      res.status(201).json({
        msg: 'Match creado con éxito',
        data: populatedMatch,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al crear match',
        error: error.message,
      });
    }
  };

  static updateMatch = async (req, res) => {
    try {
      const { seen, status_match, id } = req.body;

      const updateData = { seen, status_match };

      const updatedMatch = await Match.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate('source_user target_user');
      if (!updatedMatch) {
        return res.status(404).json({ msg: 'Match no encontrado' });
      }

      res.status(200).json({
        msg: 'Match actualizado con éxito',
        data: updatedMatch,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al actualizar match',
        error: error.message,
      });
    }
  };

  static deleteMatch = async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ msg: 'id es requerido' });
      }

      const deletedMatch = await Match.findByIdAndDelete(id);
      if (!deletedMatch) {
        return res.status(404).json({ msg: 'Match no encontrado' });
      }

      res.status(200).json({
        msg: 'Match eliminado con éxito',
        data: deletedMatch,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al eliminar match',
        error: error.message,
      });
    }
  };
}

export default MatchController;
