import { Schema, model } from 'mongoose';

const personCourtSchema = new Schema({
  person_id: {
    type: Schema.Types.ObjectId,
    ref: 'Person',
    required: true,
  },
  court_id: {
    type: Schema.Types.ObjectId,
    ref: 'Court',
    required: true,
  },
});

const PersonCourt = model('Person_Court', personCourtSchema);

export default PersonCourt;
