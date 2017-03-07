import v4 from 'uuid/v4';
import resource from 'resource-router-middleware';
import Category from '../models/category';


export default ({
  config,
  db,
}) => resource({

  /** Property name to store preloaded entity on `request`. */
  id: 'category',

  /** For requests with an `id`, you can auto-load the entity.
   *  Errors terminate the request, success sets `req[id] = data`.
   */
  load(req, id, callback) {
    const filter = {
      id,
    };

    Category.findOne(filter).exec()
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        console.log(error);
        callback('Not found');
      });
  },

  /** GET categories/ - List all entities */
  list({
    params,
  }, res) {
    Category.find().exec()
      .then(activites => res.json(activites))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** POST categories/ - Create a new entity */
  create({
    body,
  }, res) {
    const newCategory = new Category({
      id: v4(),
      name: body.name,
      user: body.user,
    });

    newCategory.save()
      .then(category => res.json(category))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** GET categories/:id - Return a given entity */
  read({
    category,
  }, res) {
    res.json(category);
  },

  /** PUT categories/:id - Update a given entity */
  update({
    category,
    body,
  }, res) {
    const filter = {
      id: category.id,
    };
    const options = {
      new: true,
    };

    Category.findOneAndUpdate(filter, body, options).exec()
      .then(result => res.json(result))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },

  /** DELETE categories/:id - Delete a given entity */
  delete({
    category,
  }, res) {
    const filter = {
      id: category.id,
    };

    Category.findOneAndRemove(filter).exec()
      .then(res.sendStatus(204))
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },
});