import {
  Router,
} from 'express';

export default ({
  config,
  db,
}) => {
  const router = Router();

  router.get('/', (req, res) => {
    res.send({
      message: 'register!!',
    });
  });
  return router;
};