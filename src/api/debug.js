import {
  Router,
} from 'express';

export default ({
  config,
  db,
  Activity,
  Timesheet,
}) => {
  const router = Router();

  router.post('/clearTimesheets', (req, res) => {
    Activity.find().exec()
      .then((activities) => {
        activities.forEach((activity) => {
          activity.timesheets = [];
          activity.save();
        });
        Timesheet.remove({}).exec();
        res.sendStatus(204);
      })
      .catch((error) => {
        res.sendStatus(500);
        throw error;
      });
  });

  return router;
};