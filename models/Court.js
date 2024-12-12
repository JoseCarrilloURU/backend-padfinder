import { model, Schema } from 'mongoose';

const courtSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  direction: {
    type: String,
    required: true,
  },
});

const Court = model('Court', courtSchema);

export default Court;
