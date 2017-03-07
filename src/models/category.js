import mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema({
  id: String,
  name: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Category', categorySchema);