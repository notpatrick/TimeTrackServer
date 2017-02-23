import { Router } from 'express';
import { version } from '../../package.json';
import activities from './activities';

export default ({ config, db }) => {
  const api = Router();

	// mount the activities resource
  api.use('/activities', activities({ config, db }));

	// perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
