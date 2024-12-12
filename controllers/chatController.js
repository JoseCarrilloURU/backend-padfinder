import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

class ChatController {
  static getChats = async (req, res) => {
    try {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ msg: 'user_id es requerido' });
      }

      const chats = await Chat.find({ users: user_id }).populate({
        path: 'users',
        select: '-image -password',
        populate: {
          path: 'person_id',
          model: 'Person',
          populate: {
            path: 'genre',
            model: 'Genre',
          },
        },
      });

      if (chats.length <= 0) {
        return res.status(404).json({
          msg: 'No se encontraron chats para el usuario',
        });
      }

      const chatIds = chats.map((chat) => chat._id);

      const lastMessages = await Message.aggregate([
        { $match: { chat_id: { $in: chatIds } } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: '$chat_id',
            lastMessage: { $first: '$$ROOT' },
          },
        },
      ]);

      const lastMessagesMap = lastMessages.reduce((acc, message) => {
        acc[message._id] = message.lastMessage;
        return acc;
      }, {});

      const filteredChats = chats.map((chat) => {
        const filteredUsers = chat.users.filter(
          (user) => user._id.toString() !== user_id,
        );

        const lastMessage = lastMessagesMap[chat._id];
        let lastMessageObj = { type_message: 'plain', description: '' };
        if (lastMessage) {
          lastMessageObj.description = lastMessage.description;
          lastMessageObj.type_message = lastMessage.type_message;
        }

        return {
          ...chat.toObject(),
          users: filteredUsers,
          lastMessage: lastMessageObj,
        };
      });

      res.status(200).json({
        msg: 'Chats obtenidos con éxito',
        data: filteredChats,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al obtener chats',
        error: error.message,
      });
    }
  };

  static addChat = async (req, res) => {
    try {
      const { users, name } = req.body;

      if (!users || users.length <= 1) {
        return res.status(400).json({
          msg: 'Se requiere al menos dos usuarios para crear un chat',
        });
      }

      const newChat = new Chat({
        users,
        name,
      });

      await newChat.save();

      res.status(201).json({
        msg: 'Chat creado con éxito',
        data: newChat,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al crear chat',
        error: error.message,
      });
    }
  };

  static updateChat = async (req, res) => {
    try {
      const { users, name, id } = req.body;

      const updateData = { users, name };

      const updatedChat = await Chat.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate({
        path: 'users',
        select: '-image -password',
      });
      if (!updatedChat) {
        return res.status(404).json({ msg: 'Chat no encontrado' });
      }

      res.status(200).json({
        msg: 'Chat actualizado con éxito',
        data: updatedChat,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al actualizar chat',
        error: error.message,
      });
    }
  };

  static deleteChat = async (req, res) => {
    try {
      const { id } = req.query;

      const ids = Array.isArray(id) ? id : [id];

      await Message.deleteMany({ chat_id: { $in: ids } });
      const deletedChat = await Chat.deleteMany({
        _id: { $in: ids },
      });

      if (deletedChat.deletedCount === 0) {
        return res.status(404).json({ msg: 'Chat no encontrado' });
      }

      res.status(200).json({
        msg: 'Chat y mensajes asociados eliminados con éxito',
        data: deletedChat,
      });
    } catch (error) {
      res.status(400).json({
        msg: 'Error al eliminar chat y mensajes asociados',
        error: error.message,
      });
    }
  };
}

export default ChatController;
