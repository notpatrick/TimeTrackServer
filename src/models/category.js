export default (mongoose) => {
  const categorySchema = new mongoose.Schema({
    id: String,
    name: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  });
  return mongoose.model('Category', categorySchema);
};