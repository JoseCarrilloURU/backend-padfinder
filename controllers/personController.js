import Person from '../models/Person.js';

class PersonController {
  static getPersons = async (req, res) => {
    try {
      const { id } = req.query;
      if (id) {
        const person = await Person.findById(id).populate('genre');
        if (!person)
          return res.status(404).json({
            msg: 'Persona no encontrada',
          });

        return res.status(200).json({
          msg: 'Persona obtenida con exito',
          data: person,
        });
      } else {
        const persons = await Person.find();

        if (persons.length <= 0) {
          return res.status(404).json({ msg: 'No se encontraron personas' });
        }

        res.status(200).json({
          msg: 'Personas obtenidas con éxito',
          data: persons,
        });
      }
    } catch (error) {
      res.status(400).json({
        msg: 'Error al obtener personas',
        error: error.message,
      });
    }
  };

  static updatePerson = async (req, res) => {
    try {
      const { id, name, lastname, email, genre, experience, preferred_genre } =
        req.body;

      const updatePerson = await Person.findByIdAndUpdate(
        id,
        {
          name,
          lastname,
          email,
          genre,
          experience,
          preferred_genre,
        },
        {
          new: true,
        },
      );

      if (!updatePerson)
        return res.status(404).json({ msg: 'Person no encontrada' });

      res.status(200).json({
        msg: 'Persona actualizada con éxito',
        data: updatePerson,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al actualizar la persona',
        error: error.message,
      });
    }
  };
}

export default PersonController;
