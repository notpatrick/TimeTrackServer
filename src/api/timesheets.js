import v4 from 'uuid/v4';
import resource from 'resource-router-middleware';
import Timesheet from '../models/timesheet';


export default ({
  config,
  db,
}) => resource({

  /** Property name to store preloaded entity on `request`. */
  id: 'timesheet',

  /** For requests with an `id`, you can auto-load the entity.
   *  Errors terminate the request, success sets `req[id] = data`.
   */
  load(req, id, callback) {
    const filter = {
      id,
    };

    Timesheet.findOne(filter).exec()
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        console.log(error);
        callback('Not found');
      });
  },

  /** GET timesheets/ - List all entities */
  list({
    params,
  }, res) {
    Timesheet.find().exec()
      .then(activites => res.json(activites))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** POST timesheets/ - Create a new entity */
  create({
    body,
  }, res) {
    // TODO: use icons from body as soon as users can pick them in app
    const iconNames = ['bicycle', 'cash', 'car', 'school', 'body', 'restaurant', 'game-controller-a', 'american-football'];
    const randomIcon = iconNames[Math.floor(Math.random() * iconNames.length)];

    const newTimesheet = new Timesheet({
      id: v4(),
      name: body.name,
      iconname: randomIcon,
      category: body.category,
      user: body.user,
    });

    newTimesheet.save()
      .then(timesheet => res.json(timesheet))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** GET timesheets/:id - Return a given entity */
  read({
    timesheet,
  }, res) {
    res.json(timesheet);
  },

  /** PUT timesheets/:id - Update a given entity */
  update({
    timesheet,
    body,
  }, res) {
    const filter = {
      id: timesheet.id,
    };
    const options = {
      new: true,
    };

    Timesheet.findOneAndUpdate(filter, body, options).exec()
      .then(result => res.json(result))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** DELETE timesheets/:id - Delete a given entity */
  delete({
    timesheet,
  }, res) {
    const filter = {
      id: timesheet.id,
    };

    Timesheet.findOneAndRemove(filter).exec()
      .then(res.sendStatus(204))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },
});