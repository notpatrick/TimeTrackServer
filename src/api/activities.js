import v4 from 'uuid/v4';
import {
  Router,
} from 'express';
import ActivityModel from '../models/activity';

export default ({
  config,
  db,
}) => {
  const router = Router();
  const Activity = ActivityModel(db);

  // GET all
  router.get('/', (req, res) => {
    Activity.find().exec()
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

    Activity.findOne(filter).exec()
      .then((activity) => {
        if (activity === null) res.sendStatus(404);
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
      activity: req.body.activity,
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

    Activity.findOneAndUpdate(filter, req.body, options).exec()
      .then((activity) => {
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
      .then(res.sendStatus(204))
      .catch(() => {
        res.sendStatus(500);
      });
  });

  return router;
};