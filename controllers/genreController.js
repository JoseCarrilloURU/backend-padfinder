import Genre from '../models/Genre.js';

class GenreController {
  static getGenres = async (_req, res) => {
    try {
      const genres = await Genre.find();
      if (genres.length <= 0)
        return res.status(404).json({ msg: 'No se encontraron generos' });

      res.status(200).json({
        msg: 'Generos obtenidos con exito',
        data: genres,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al obtener generos',
      });
    }
  };

  static createGenre = async (req, res) => {
    try {
      const { description } = req.body;
      const newGenre = new Genre({ description });
      await newGenre.save();

      res.status(201).json({
        msg: 'Genero creado con exito',
        data: newGenre,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al crear genero',
      });
    }
  };
}

export default GenreController;
