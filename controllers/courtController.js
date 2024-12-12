import Court from '../models/Court.js';
import multer from 'multer';

class CourtController {
  static getCourts = async (_req, res) => {
    try {
      const courts = await Court.find().select('-image');
      if (courts.length <= 0)
        return res.status(404).json({ msg: 'No se encontraron canchas' });

      res.status(200).json({
        msg: 'Canchas obtenidas con éxito',
        data: courts,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al obtener canchas',
        error: error.message,
      });
    }
  };

  static createCourt = async (req, res) => {
    try {
      const { name, description, direction } = req.body;
      const newCourt = new Court({
        name,
        description,
        direction,
        image: req.file
          ? { data: req.file.buffer, contentType: req.file.mimetype }
          : undefined,
      });
      const court = await newCourt.save();

      const courtObject = court.toObject();
      delete courtObject.image;

      res.status(201).json({
        msg: 'Cancha creada con éxito',
        data: courtObject,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al crear cancha',
        error: error.message,
      });
    }
  };

  static updateCourt = async (req, res) => {
    try {
      const { id, name, description, direction } = req.body;

      const image = req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : undefined;

      const updatedCourt = await Court.findByIdAndUpdate(
        id,
        { name, description, image, direction },
        {
          new: true,
        },
      );

      if (!updatedCourt) {
        return res.status(404).json({ msg: 'Cancha no encontrada' });
      }

      const courtObject = updatedCourt.toObject();
      delete courtObject.image;

      res.status(200).json({
        msg: 'Cancha actualizada con éxito',
        data: courtObject,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al actualizar cancha',
        error: error.message,
      });
    }
  };

  static getImage = async (req, res) => {
    try {
      const { id } = req.query;
      const court = await Court.findById(id);

      if (!court || !court.image) {
        return res.status(404).json({ msg: 'Imagen no encontrada' });
      }

      res.set('Content-Type', court.image.contentType);
      res.send(court.image.data);
    } catch (error) {
      res.status(400).json({
        msg: 'Error al obtener imagen',
        error: error.message,
      });
    }
  };
}

export default CourtController;
