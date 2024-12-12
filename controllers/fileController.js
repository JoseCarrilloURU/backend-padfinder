import File from '../models/File.js';

class FileController {
  static getFile = async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      if (!file) {
        return res.status(404).json({ msg: 'No se encontro el archivo' });
      }

      res.set('Content-Type', file.mimeType);
      res.send(file.data);
    } catch (error) {
      res.status(500).json({ msg: 'Error al obtener multimedia' });
    }
  };
}

export default FileController;
