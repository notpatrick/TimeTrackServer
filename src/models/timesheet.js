export default (mongoose) => {
  const timesheetSchema = new mongoose.Schema({
    id: String,
    startDate: Date,
    endDate: Date,
    activity: {
      type: mongoose.Schema.ObjectId,
      ref: 'Activity',
    },
  });
  return mongoose.model('Timesheet', timesheetSchema);
};