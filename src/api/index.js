import {
  Router,
} from 'express';
import activities from './activities';
import categories from './categories';
import users from './users';
import login from './login';
import register from './register';

export default ({
  config,
  db,
}) => {
  const api = Router();

  // mount the resources
  api
    .use('/activities', activities({
      config,
      db,
    }))
    .use('/categories', categories({
      config,
      db,
    }))
    .use('/users', users({
      config,
      db,
    }))
    .use('/login', login({
      config,
      db,
    }))
    .use('/register', register({
      config,
      db,
    }));

  return api;
};