import {
  Router,
} from 'express';
import {
  version,
} from '../../package.json';
import activities from './activities';
import categories from './categories';
import login from './login';
import timesheets from './timesheets';
import users from './users';

export default ({
  config,
  db,
}) => {
  const api = Router();

  // mount the resources
  api.use('/activities', activities({
    config,
    db,
  }));

  api.use('/categories', categories({
    config,
    db,
  }));

  api.use('/login', login);

  api.use('/timesheets', timesheets({
    config,
    db,
  }));

  api.use('/users', users({
    config,
    db,
  }));

  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.json({
      version,
    });
  });

  return api;
};