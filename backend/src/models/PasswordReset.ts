import mongoose, { Schema, Document } from 'mongoose';

interface IPasswordResetDocument extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const passwordResetSchema = new Schema<IPasswordResetDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

passwordResetSchema.index({ token: 1 });
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordReset = mongoose.model<IPasswordResetDocument>(
  'PasswordReset',
  passwordResetSchema
);