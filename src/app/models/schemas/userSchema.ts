import mongoose, { Schema } from 'mongoose';
import { settingsSchema } from './settingsSchema';
import { notesSchema } from './notesSchema';

const userSchema = new Schema(
  {
    user: {
      uid: {
        type: String,
        required: true,
      },
      displayName: {
        type: String,
        required: true,
      },
    },
    settings: settingsSchema,
    notes: [notesSchema],
  },
  {
    timestamps: true,
  }
);

const MongooseUser = mongoose.models.MongooseUser || mongoose.model('MongooseUser', userSchema);

export default MongooseUser;