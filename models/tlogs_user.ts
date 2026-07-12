import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ITLogsUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  isSubscribed: boolean;
  isStudent: boolean;
  subsPlan: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const TLogsUserSchema = new Schema<ITLogsUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    isSubscribed: { type: Boolean, default: false },
    isStudent: { type: Boolean, default: false },
    subsPlan: { type: Number, default: null },
  },
  { timestamps: true }
);

export const TLogsUserModel: Model<ITLogsUser> =
  mongoose.models.TLogsUser || mongoose.model<ITLogsUser>('TLogsUser', TLogsUserSchema);
