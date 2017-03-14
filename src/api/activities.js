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
        res.status(500).body(error).send();
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
        res.status(500).body(error).send();
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
        res.status(500).body(error).send();
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
        res.status(500).body(error).send();
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
        res.status(500).body(error).send();
        throw error;
      });
  });
  // returns a closed timesheet or false if no timesheet was closed
  function closeAllOpenTimesheets(endDate) {
    const filter = {
      endDate: undefined,
    };
    return Timesheet.find(filter)
      .exec()
      .then((foundTimesheet) => {
        if (!foundTimesheet) return Promise.resolve(false);
        // an open timesheet is found, close it with endDate and return it as a promise
        foundTimesheet.forEach((timesheet) => {
          timesheet.endDate = endDate;
          return timesheet
            .save()
            .then(resultTimesheet => resultTimesheet);
        });
        return Promise.resolve(false);
      });
  }

  function createTimesheet(request) {
    // create new timesheet
    const newTimesheet = new Timesheet(request.timesheet);

    return newTimesheet
      .save()
      .then((savedTimesheet) => {
        const filter = {
          id: request.activity.id,
        };
        return Activity
          .findOne(filter)
          .exec()
          .then((foundActivity) => {
            foundActivity.timesheets.push(savedTimesheet._id);
            return foundActivity.save();
          })
          .then(savedActivity => Activity.populate(savedActivity, {
            path: 'category user timesheets',
          }));
      });
  }

  // req.body.activity is an activity, req.body.date is a date
  router.post('/track', (req, res) => {
    const request = {
      date: req.body.date,
      timesheet: req.body.timesheet,
      activity: req.body.activity,
    };
    const timesheetFilter = {
      id: request.timesheet.id,
    };

    Timesheet
      .findOne(timesheetFilter)
      .exec()
      .then((existingTimesheet) => {
        if (existingTimesheet) {
          const isOpen = !existingTimesheet.endDate;
          if (isOpen) {
            // close timesheet and return updated activity
            existingTimesheet.endDate = request.date;
            existingTimesheet
              .save()
              .then(() => {
                const filter = {
                  id: request.activity.id,
                };
                Activity
                  .findOne(filter)
                  .populate('category user timesheets')
                  .exec()
                  .then(updatedActivity => res.send(updatedActivity));
              });
          } else {
            res.sendStatus(500);
          }
        } else {
          closeAllOpenTimesheets(request.date)
            .then(createTimesheet(request).then(populatedActivity => res.send(populatedActivity)));
        }
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  });

  return router;
};