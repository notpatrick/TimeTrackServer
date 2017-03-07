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
      .catch(() => {
        res.sendStatus(500);
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
      .catch(() => {
        res.sendStatus(500);
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

    Category.findOneAndUpdate(filter, req.body, options).exec()
      .then((category) => {
        res.json(category);
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

    Category.findOneAndRemove(filter).exec()
      .then(res.sendStatus(204))
      .catch(() => {
        res.sendStatus(500);
      });
  });

  return router;
};