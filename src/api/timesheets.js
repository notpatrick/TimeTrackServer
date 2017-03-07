import v4 from 'uuid/v4';
import {
  Router,
} from 'express';
import TimesheetModel from '../models/timesheet';

export default ({
  config,
  db,
}) => {
  const router = Router();
  const Timesheet = TimesheetModel(db);

  // GET all
  router.get('/', (req, res) => {
    Timesheet.find().exec()
      .then((activites) => {
        res.json(activites);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  });

  // GET by id
  router.get('/:id', (req, res) => {
    const filter = {
      id: req.params.id,
    };
    Timesheet.findOne(filter).exec()
      .then((timesheet) => {
        res.json(timesheet);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  });

  // POST
  router.post('/', (req, res) => {
    const newTimesheet = new Timesheet({
      id: v4(),
      startDate: req.body.startDate,
      endDate: undefined,
      activity: req.body.activity._id,
    });

    newTimesheet.save()
      .then((timesheet) => {
        res.json(timesheet);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  });

  // PUT
  router.put('/:id', (req, res) => {
    const filter = {
      id: req.params.id,
    };
    const options = {
      new: true,
    };

    Timesheet.findOneAndUpdate(filter, req.body, options).exec()
      .then((timesheet) => {
        res.json(timesheet);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  });

  return router;
};