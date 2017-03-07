export default (mongoose) => {
  const activitySchema = new mongoose.Schema({
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
    timesheets: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Timesheet',
    }],
  });
  return mongoose.model('Activity', activitySchema);
};