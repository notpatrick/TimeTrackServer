import v4 from 'uuid/v4';
import {
  Router,
} from 'express';
import ActivityModel from '../models/activity';
import TimesheetModel from '../models/timesheet';

export default ({
  config,
  db,
  Activity,
  Timesheet,
}) => {
  const router = Router();

  // GET all
  router.get('/', (req, res) => {
    Activity.find()
      .populate('category user timesheets')
      .exec()
      .then((activities) => {
        res.json(activities);
      })
      .catch((error) => {
        res.sendStatus(500);
        throw error;
      });
  });

  // GET by id
  router.get('/:id', (req, res) => {
    const filter = {
      id: req.params.id,
    };

    Activity.findOne(filter)
      .populate('category user timesheets')
      .exec()
      .then((activity) => {
        if (!activity) res.sendStatus(404);
        res.json(activity);
      })
      .catch((error) => {
        res.sendStatus(500);
        throw error;
      });
  });

  // POST
  router.post('/', (req, res) => {
    const newActivity = new Activity({
      id: v4(),
      name: req.body.name,
      iconname: req.body.iconname,
      category: req.body.category._id,
      user: req.body.user._id,
    });

    newActivity.save()
      .then((activity) => {
        res.json(activity);
      })
      .catch((error) => {
        res.sendStatus(500);
        throw error;
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

    Activity.findOneAndUpdate(filter, req.body, options)
      .populate('category user timesheets')
      .exec()
      .then((activity) => {
        if (!activity) res.sendStatus(404);
        res.json(activity);
      })
      .catch((error) => {
        res.sendStatus(500);
        throw error;
      });
  });

  // DELETE by id
  router.delete('/:id', (req, res) => {
    const filter = {
      id: req.params.id,
    };

    Activity.findOneAndRemove(filter).exec()
      .then(() => {
        res.sendStatus(204);
      })
      .catch((error) => {
        res.sendStatus(500);
        throw error;
      });
  });

  // returns a Promise with an Activity in it
  function createTimesheet(activity, startDate) {
    // Create new timesheet
    const newTimesheet = new Timesheet({
      id: v4(),
      startDate,
      endDate: undefined,
      activity: activity._id,
    });
    // add it to activity.timesheets, return activity as a promise
    return newTimesheet.save()
      .then((timesheet) => {
        activity.timesheets.push(timesheet._id);
        return activity
          .save();
      });
  }

  // returns a closed timesheet or false if no timesheet was closed
  function closeOpenTimesheet(endDate) {
    const filter = {
      endDate: undefined,
    };
    return Timesheet.findOne(filter)
      .populate('activity')
      .exec()
      .then((ts) => {
        if (ts) {
          // an open timesheet is found, close it with endDate and return it as a promise
          ts.endDate = endDate;
          return ts
            .save()
            .then(resultTimesheet => resultTimesheet);
        }
        return Promise.resolve(false);
      });
  }

  // req.body.activity is an activity, req.body.date is a date
  router.post('/track', (req, res) => {
    const request = {
      date: req.body.date,
      timesheet: req.body.timesheet,
      activity: req.body.activity,
    };
    if (request.timesheet._id) {
      const filter = {
        id: request.timesheet.id,
      };
      Timesheet.findOne(filter).exec()
        .then((ts) => {
          const isOpen = !ts.endDate;
          if (isOpen) {
            // close
          } else {
            // existing timestamp is not open, something went wrong -> server/client data not sync
          }
        })
        .catch((error) => {
          res.sendStatus(500);
          throw error;
        });
    } else {
      // create new timesheet
    }
  });

  return router;
};