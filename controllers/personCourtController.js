import PersonCourt from '../models/Person_Court.js';

class PersonCourtController {
  static addCourtToPerson = async (req, res) => {
    try {
      const { person_id, court_id } = req.body;
      const newPersonCourt = new PersonCourt({ person_id, court_id });
      await newPersonCourt.save();

      res.status(201).json({
        msg: 'Cancha agregada a la persona con éxito',
        data: newPersonCourt,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al agregar cancha a la persona',
        error: error.message,
      });
    }
  };

  static removeCourtFromPerson = async (req, res) => {
    try {
      const { id } = req.query;
      const ids = Array.isArray(id) ? id : [id];

      const deletedPersonCourt = await PersonCourt.deleteMany({
        _id: { $in: ids },
      });

      if (!deletedPersonCourt) {
        return res.status(404).json({ msg: 'Relación no encontrada' });
      }

      res.status(200).json({
        msg: 'Cancha eliminada de la persona con éxito',
        data: deletedPersonCourt,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al eliminar cancha de la persona',
        error: error.message,
      });
    }
  };

  static getCourtsByPerson = async (req, res) => {
    try {
      const { id: person_id } = req.query;
      const personCourts = await PersonCourt.find({ person_id }).populate({
        path: 'court_id',
        select: '-image',
      });

      if (personCourts.length === 0) {
        return res
          .status(404)
          .json({ msg: 'No se encontraron canchas para esta persona' });
      }

      res.status(200).json({
        msg: 'Canchas obtenidas con éxito',
        data: personCourts.map((pc) => ({
          _id: pc._id,
          person_id: pc.person_id,
          court: {
            _id: pc.court_id._id,
            name: pc.court_id.name,
            description: pc.court_id.description,
            direction: pc.court_id.direction,
          },
        })),
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al obtener canchas para la persona',
        error: error.message,
      });
    }
  };

  static getPersonsByCourt = async (req, res) => {
    try {
      const { id: court_id } = req.query;
      const courtPersons = await PersonCourt.find({ court_id }).populate(
        'person_id',
      );

      if (courtPersons.length === 0) {
        return res
          .status(404)
          .json({ msg: 'No se encontraron personas para esta cancha' });
      }

      res.status(200).json({
        msg: 'Personas obtenidas con éxito',
        data: courtPersons.map((pc) => ({
          _id: pc._id,
          court_id: pc.court_id,
          person: {
            _id: pc.person_id._id,
            name: pc.person_id.name,
            lastname: pc.person_id.lastname,
            email: pc.person_id.email,
            genre: pc.person_id.genre,
            experience: pc.person_id.experience,
            preferred_genre: pc.person_id.preferred_genre,
          },
        })),
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al obtener personas para la cancha',
        error: error.message,
      });
    }
  };
}

export default PersonCourtController;
