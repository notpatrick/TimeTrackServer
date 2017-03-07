import v4 from 'uuid/v4';
import resource from 'resource-router-middleware';
import User from '../models/user';


export default ({
  config,
  db,
}) => resource({

  /** Property name to store preloaded entity on `request`. */
  id: 'user',

  /** For requests with an `id`, you can auto-load the entity.
   *  Errors terminate the request, success sets `req[id] = data`.
   */
  load(req, id, callback) {
    const filter = {
      id,
    };

    User.findOne(filter).exec()
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        console.log(error);
        callback('Not found');
      });
  },

  /** GET users/ - List all entities */
  list({
    params,
  }, res) {
    User.find().exec()
      .then(activites => res.json(activites))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** POST users/ - Create a new entity */
  create({
    body,
  }, res) {
    const newUser = new User({
      id: v4(),
      name: body.name,
      password: body.password,
      email: body.email,
    });

    newUser.save()
      .then(user => res.json(user))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** GET users/:id - Return a given entity */
  read({
    user,
  }, res) {
    res.json(user);
  },

  /** PUT users/:id - Update a given entity */
  update({
    user,
    body,
  }, res) {
    const filter = {
      id: user.id,
    };
    const options = {
      new: true,
    };

    User.findOneAndUpdate(filter, body, options).exec()
      .then(result => res.json(result))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** DELETE users/:id - Delete a given entity */
  delete({
    user,
  }, res) {
    const filter = {
      id: user.id,
    };

    User.findOneAndRemove(filter).exec()
      .then(res.sendStatus(204))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },
});