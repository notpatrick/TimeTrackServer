import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  password: String,
  email: String,
});

export default mongoose.model('User', userSchema);