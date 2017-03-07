export default (mongoose) => {
  const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    password: String,
    email: String,
  });
  return mongoose.model('User', userSchema);
};