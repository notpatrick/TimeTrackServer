import v4 from 'uuid/v4';
import resource from 'resource-router-middleware';
import Activity from '../models/activity.schema';


export default ({
  config,
  db,
}) => resource({

  /** Property name to store preloaded entity on `request`. */
  id: 'activity',

  /** For requests with an `id`, you can auto-load the entity.
   *  Errors terminate the request, success sets `req[id] = data`.
   */
  load(req, id, callback) {
    const filter = {
      id,
    };

    Activity.findOne(filter).exec()
      .catch((error) => {
        console.log(error);
        callback('Not found');
      })
      .then((result) => {
        callback(null, result);
      });
  },

  /** GET / - List all entities */
  list({
    params,
  }, res) {
    Activity.find().exec()
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      })
      .then(activites => res.json(activites));
  },

  /** POST / - Create a new entity */
  create({
    body,
  }, res) {
    // TODO: use icons from body as soon as users can pick them in app
    const iconNames = ['bicycle', 'cash', 'car', 'school', 'body', 'restaurant', 'game-controller-a', 'american-football'];
    const randomIcon = iconNames[Math.floor(Math.random() * iconNames.length)];

    const newActivity = new Activity({
      id: v4(),
      name: body.name,
      type: body.type,
      icon: randomIcon,
      elapsedSeconds: 0,
    });

    newActivity.save()
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      })
      .then(activity => res.json(activity));
  },

  /** GET /:id - Return a given entity */
  read({
    activity,
  }, res) {
    res.json(activity);
  },

  /** PUT /:id - Update a given entity */
  update({
    activity,
    body,
  }, res) {
    const filter = {
      id: activity.id,
    };
    const options = {
      new: true,
    };

    Activity.findOneAndUpdate(filter, body, options).exec()
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      })
      .then(result => res.json(result));
  },

  /** DELETE /:id - Delete a given entity */
  delete({
    activity,
  }, res) {
    const filter = {
      id: activity.id,
    };

    Activity.findOneAndRemove(filter).exec()
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      })
      .then(res.sendStatus(204));
  },
});