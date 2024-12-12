import { Schema, model } from 'mongoose';

const fileSchema = new Schema({
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  data: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },
});

const File = model('File', fileSchema);

export default File;
