import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  name: {
    type: String,
  },
});

const Chat = model('Chat', chatSchema);

export default Chat;
