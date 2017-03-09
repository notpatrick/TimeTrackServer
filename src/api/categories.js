import v4 from 'uuid/v4';
import {
  Router,
} from 'express';
import CategoryModel from '../models/category';

export default ({
  config,
  db,
}) => {
  const router = Router();
  const Category = CategoryModel(db);

  // GET all
  router.get('/', (req, res) => {
    Category.find().exec()
      .then((categories) => {
        res.json(categories);
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
    Category.findOne(filter).exec()
      .then((category) => {
        if (category === null) res.sendStatus(404);
        res.json(category);
      })
      .catch((error) => {
        res.sendStatus(500);
        throw error;
      });
  });

  // POST
  router.post('/', (req, res) => {
    const newCategory = new Category({
      id: v4(),
      name: req.body.name,
      user: req.body.user._id,
    });

    newCategory.save()
      .then((category) => {
        res.json(category);
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

    Category.findOneAndUpdate(filter, req.body, options).exec()
      .then((category) => {
        res.json(category);
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

    Category.findOneAndRemove(filter).exec()
      .then(res.sendStatus(204))
      .catch((error) => {
        res.sendStatus(500);
        throw error;
      });
  });

  return router;
};