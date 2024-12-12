import { Schema, model } from 'mongoose';

const genreSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
});

const Genre = model('Genre', genreSchema);

export default Genre;
