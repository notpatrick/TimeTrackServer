import v4 from 'uuid/v4';
import resource from 'resource-router-middleware';
import Activity from '../models/activity';


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
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        console.log(error);
        callback('Not found');
      });
  },

  /** GET activities/ - List all entities */
  list({
    params,
  }, res) {
    Activity.find().exec()
      .then(activites => res.json(activites))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** POST activities/ - Create a new entity */
  create({
    body,
  }, res) {
    const newActivity = new Activity({
      id: v4(),
      name: body.name,
      iconname: body.iconname,
      category: body.category,
      user: body.user,
    });

    newActivity.save()
      .then(activity => res.json(activity))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** GET activities/:id - Return a given entity */
  read({
    activity,
  }, res) {
    res.json(activity);
  },

  /** PUT activities/:id - Update a given entity */
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
      .then((result) => {
        console.log(JSON.stringify(result));
        res.json(result);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** DELETE activities/:id - Delete a given entity */
  delete({
    activity,
  }, res) {
    const filter = {
      id: activity.id,
    };

    Activity.findOneAndRemove(filter).exec()
      .then(res.sendStatus(204))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },
});