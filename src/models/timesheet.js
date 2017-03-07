import mongoose from 'mongoose';

export const timesheetSchema = new mongoose.Schema({
  id: String,
  startDate: Date,
  endDate: Date,
  activity: {
    type: mongoose.Schema.ObjectId,
    ref: 'Activity',
  },
});

export default mongoose.model('Timesheet', timesheetSchema);