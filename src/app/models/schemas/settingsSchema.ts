import { Schema } from 'mongoose';

export const settingsSchema = new Schema({
  instances: {
    type: Number,
    required: true,
  },
  showForm: {
    type: Boolean,
    required: true,
  },
  showMatchingString: {
    type: Boolean,
    required: true,
  },
  animations: {
    type: Boolean,
    required: true,
  },
  autoFill: {
    type: Boolean,
    required: true,
  },
});
