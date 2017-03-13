import {
  Router,
} from 'express';

export default ({
  config,
  db,
  Activity,
  Timesheet,
}) => {
  const router = Router();

  router.get('/', (req, res) => {
    res.send({
      message: 'Hello World!!',
    });
  });
  return router;
};