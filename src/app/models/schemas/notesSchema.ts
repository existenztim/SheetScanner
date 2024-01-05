import { Schema } from 'mongoose';

export const notesSchema = new Schema({
  type: {
    type: Object,
    required: true,
  },
  createDate: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: String,
  },
  fileName: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    default: 'MyNote',
  },
});
