import File from '../models/File.js';
import Message from '../models/Message.js';

class MessageController {
  static handleChatMessage = async (req, res) => {
    const socketServer = req.app.get('socketServer');
    try {
      const { chatId, senderId, description } = req.body;

      let fileDoc;
      if (req.file) {
        const { originalname, mimetype, buffer } = req.file;

        fileDoc = new File({
          originalName: originalname,
          mimeType: mimetype,
          data: buffer,
        });
        await fileDoc.save();
      }

      const message = new Message({
        chat_id: chatId,
        sender_user: senderId,
        description,
        file_id: fileDoc?._id,
        type_message: fileDoc
          ? fileDoc.mimeType.startsWith('audio')
            ? 'audio'
            : 'image'
          : undefined,
        seen: false,
      });
      await message.save();

      const fileUrl = fileDoc ? `/api/file/${fileDoc._id}` : null;
      const messagePayload = {
        chatId,
        senderId,
        description,
        file: !fileDoc
          ? {}
          : {
              id: fileDoc._id,
              name: fileDoc.originalName,
              type: fileDoc.mimeType,
              url: fileUrl,
            },
      };

      socketServer.emitChatMessage(chatId, messagePayload);

      res
        .status(201)
        .json({ message: 'Message sent successfully', data: messagePayload });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updateMessage = async (req, res) => {
    try {
      const { description, seen, id } = req.body;

      if (!description && req.file === undefined) {
        return res
          .status(400)
          .json({ error: 'No se puede actualizar a un mensaje vacío' });
      }

      const updateData = { description, seen };

      if (req.file) {
        const { originalname, mimetype, buffer } = req.file;

        const fileDoc = new File({
          originalName: originalname,
          mimeType: mimetype,
          data: buffer,
        });
        await fileDoc.save();

        updateData.file_id = fileDoc._id;
        updateData.type_message = mimetype.startsWith('audio')
          ? 'audio'
          : 'image';
      }

      const message = await Message.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate('file_id');
      if (!message) {
        return res.status(404).json({ msg: 'Mensaje no encontrado' });
      }

      if (message.file_id) {
        const fileUrl = `/api/files/${message.file_id._id}`;
        message.url = fileUrl;
      }

      res.status(200).json({
        msg: 'Mensaje actualizado con éxito',
        data: message,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al actualizar mensaje',
        error: error.message,
      });
    }
  };

  static getMessageByChat = async (req, res) => {
    try {
      const { chat_id } = req.query;

      if (!chat_id) {
        return res.status(400).json({ msg: 'chat_id is required' });
      }

      const messages = await Message.find({ chat_id })
        .populate({
          path: 'file_id',
          select: '-data',
        })
        .populate({
          path: 'sender_user',
          select: '-password -image',
        });

      if (messages.length <= 0) {
        return res
          .status(404)
          .json({ msg: 'No se encontraron mensajes para el chat' });
      }

      const messagesWithUrl = await Promise.all(
        messages.map(async (message) => {
          if (message.file_id) {
            const file = await File.findById(message.file_id);
            message = message.toObject();
            message.url = `/api/file/${file._id}`;
          }
          return message;
        }),
      );

      res.status(200).json({
        msg: 'Mensajes obtenidos con éxito',
        data: messagesWithUrl,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al obtener mensajes',
        error: error.message,
      });
    }
  };

  static deleteMessage = async (req, res) => {
    try {
      const { id } = req.query;

      const ids = Array.isArray(id) ? id : [id];
      const message = await Message.deleteMany({
        _id: { $in: ids },
      });
      if (!message) {
        return res.status(404).json({ msg: 'Mensaje no encontrado' });
      }
      res.status(200).json({
        msg: 'Mensaje eliminado con éxito',
        data: message,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al eliminar mensaje',
        error: error.message,
      });
    }
  };
}

export default MessageController;
