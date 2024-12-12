import { Schema, model } from 'mongoose';

const personSchema = new Schema({
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  genre: {
    type: Schema.Types.ObjectId,
    ref: 'Genre',
  },
  age: {
    type: Number,
  },
  experience: {
    type: Number,
  },
  preferred_genre: {
    type: Schema.Types.ObjectId,
    ref: 'Genre',
  },
});

const Person = model('Person', personSchema);

export default Person;
