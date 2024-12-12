import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
  chat_id: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  sender_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
  },
  file_id: {
    type: Schema.Types.ObjectId,
    ref: 'File',
  },
  type_message: {
    type: String,
    enum: ['audio', 'image'],
  },
  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = model('Message', messageSchema);

export default Message;
