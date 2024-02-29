// Creating user schema
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// model
export const userModel = mongoose.model('User', userSchema);
