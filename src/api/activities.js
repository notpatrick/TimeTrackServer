import v4 from 'uuid/v4';
import {
  Router,
} from 'express';
import ActivityModel from '../models/activity';
import TimesheetModel from '../models/timesheet';

export default ({
  config,
  db,
}) => {
  const router = Router();
  const Activity = ActivityModel(db);
  const Timesheet = TimesheetModel(db);

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
            .then((t) => {
              console.log(t);
              return t;
            });
        }
        return Promise.resolve(false);
      });
  }

  // req.body.activity is an activity, req.body.date is a date
  router.post('/track', (req, res) => {
    const postedActivity = req.body.activity;
    const postedDate = req.body.date;
    const filter = {
      id: postedActivity.id,
    };
    closeOpenTimesheet(postedDate)
      .then((result) => {
        if (result) {
          console.log(result.activity.id, postedActivity.id);
          if (result.activity.id === postedActivity.id) {
            // posted activity was the open one, so just return the updated activity
            return Activity.findOne(filter)
              .populate('category user timesheets')
              .exec();
          }
        }
        // posted activity was not the open one or no timesheet was closed
        // so create a timesheet for postedActivity and return the updated activity
        return Activity.findOne(filter)
          .populate('category user timesheets')
          .exec()
          .then(activity => createTimesheet(activity, postedDate))
          .then(activity => Activity
            .findOne(activity)
            .populate('category user timesheets')
            .exec());
      })
      .then(activity => res.json(activity))
      .catch((error) => {
        console.error(error);
        res.sendStatus(500);
        throw error;
      });
  });

  router.post('/debug/clearTimesheets', (req, res) => {
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