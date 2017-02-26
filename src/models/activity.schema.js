import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  id: String,
  name: String,
  type: String,
  icon: String,
  elapsedSeconds: Number,
});

export default mongoose.model('Activity', activitySchema);
