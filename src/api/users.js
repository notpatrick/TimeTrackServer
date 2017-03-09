import v4 from 'uuid/v4';
import {
  Router,
} from 'express';
import UserModel from '../models/user';

export default ({
  config,
  db,
}) => {
  const router = Router();
  const User = UserModel(db);

  // GET all
  router.get('/', (req, res) => {
    User.find().exec()
      .then((user) => {
        res.json(user);
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

    User.findOne(filter).exec()
      .then((user) => {
        if (!user) res.sendStatus(404);
        res.json(user);
      })
      .catch((error) => {
        res.sendStatus(500);
        throw error;
      });
  });

  // POST
  router.post('/', (req, res) => {
    const newUser = new User({
      id: v4(),
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    });

    newUser.save()
      .then((user) => {
        res.json(user);
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

    User.findOneAndUpdate(filter, req.body, options).exec()
      .then((user) => {
        res.json(user);
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

    User.findOneAndRemove(filter).exec()
      .then(res.sendStatus(204))
      .catch((error) => {
        res.sendStatus(500);
        throw error;
      });
  });

  return router;
};