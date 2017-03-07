import mongoose from 'mongoose';

export const activitySchema = new mongoose.Schema({
  id: String,
  name: String,
  iconname: String,
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Activity', activitySchema);