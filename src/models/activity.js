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
  });
  return mongoose.model('Activity', activitySchema);
};