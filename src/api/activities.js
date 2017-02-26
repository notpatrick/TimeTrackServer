import resource from 'resource-router-middleware';
import activitiesModel from '../models/activities';

let activites = Array.from(activitiesModel);

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
    const activity = activites.find(a => a.id === id),
      err = activity ? null : 'Not found';
    console.log(id, activity);
    callback(err, activity);
  },

  /** GET / - List all entities */
  list({
    params,
  }, res) {
    res.json(activites);
  },

  /** POST / - Create a new entity */
  create({
    body,
  }, res) {
    body.id = activites.length.toString(36);
    body.elapsedSeconds = 0;
    console.log(body);
    activites.push(body);
    res.json(body);
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
    let result = {};
    activites = activites.map((a) => {
      if (a.id === activity.id) {
        result = Object.assign({}, {
          id: activity.id,
        }, body);
        return result;
      }
      return a;
    });
    res.json(result);
  },

  /** DELETE /:id - Delete a given entity */
  delete({
    activity,
  }, res) {
    activites = activites.filter(a => a !== activity);
    res.sendStatus(204);
  },
});
