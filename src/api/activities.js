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
      .catch(() => {
        res.sendStatus(500);
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
      .catch(() => {
        res.sendStatus(500);
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

    Activity.findOneAndUpdate(filter, req.body, options)
      .populate('category user')
      .exec()
      .then((activity) => {
        if (!activity) res.sendStatus(404);
        res.json(activity);
      })
      .catch(() => {
        res.sendStatus(500);
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
      .catch(() => {
        res.sendStatus(500);
      });
  });

  router.post('/:id/start', (req, res) => {
    // Create new timesheet
    const newTimesheet = new Timesheet({
      id: v4(),
      startDate: req.body.startDate,
      endDate: undefined,
      activity: req.params.id,
    });
    // filter to find open timesheets
    const filter = {
      activity: req.params.id,
      endDate: undefined,
    };

    // look for open timesheet
    Timesheet.findOne(filter).exec()
      .then((openTimesheet) => {
        // check if there was a result
        if (openTimesheet !== null) {
          // close open timesheet with startdate of new timesheet then save new timesheet
          openTimesheet.endDate = req.body.startDate;
          openTimesheet.save()
            .then(() => {
              newTimesheet.save()
                .then((timesheet) => {
                  Activity
                    .findOneAndUpdate({
                      _id: req.params.id,
                    }, {
                      $push: {
                        timesheets: timesheet._id,
                      },
                    })
                    .exec()
                    .then((activity) => {
                      if (!activity) res.sendStatus(404);
                      res.json(activity);
                    });
                  res.json(timesheet);
                })
                .catch(() => {
                  res.sendStatus(500);
                });
            });
        } else {
          // if there is no open timesheet just create a new one
          newTimesheet.save()
            .then((timesheet) => {
              Activity
                .findOneAndUpdate({
                  _id: req.params.id,
                }, {
                  $push: {
                    timesheets: timesheet._id,
                  },
                })
                .exec()
                .then((activity) => {
                  if (!activity) res.sendStatus(404);
                  res.json(activity);
                });
              res.json(timesheet);
            })
            .catch(() => {
              res.sendStatus(500);
            });
        }
      })
      .catch(() => {
        res.sendStatus(500);
      });
  });

  router.post('/:id/stop', (req, res) => {
    // find timesheet for this activity with no endDate
    const filter = {
      activity: req.params.id,
      endDate: undefined,
    };
    // return timesheet with updated properties
    const options = {
      new: true,
    };
    // set endDate to now
    const update = {
      endDate: req.body.endDate,
    };

    Timesheet.findOneAndUpdate(filter, update, options).exec()
      .then((timesheet) => {
        if (!timesheet) res.sendStatus(404); // didn't find an open timesheet
        res.json(timesheet); // return updated timesheet
      })
      .catch(() => {
        res.sendStatus(500);
      });
  });

  return router;
};