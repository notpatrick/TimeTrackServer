import {
  Router,
} from 'express';
import activities from './activities';
import categories from './categories';
import users from './users';
import login from './login';
import register from './register';
import debug from './debug';

import ActivityModel from '../models/activity';
import TimesheetModel from '../models/timesheet';

export default ({
  config,
  db,
}) => {
  const api = Router();
  const Activity = ActivityModel(db);
  const Timesheet = TimesheetModel(db);

  // mount the resources
  api
    .use('/activities', activities({
      config,
      db,
      Activity,
      Timesheet,
    }))
    .use('/categories', categories({
      config,
      db,
      Activity,
      Timesheet,
    }))
    .use('/users', users({
      config,
      db,
      Activity,
      Timesheet,
    }))
    .use('/login', login({
      config,
      db,
      Activity,
      Timesheet,
    }))
    .use('/register', register({
      config,
      db,
      Activity,
      Timesheet,
    }))
    .use('/debug', debug({
      config,
      db,
      Activity,
      Timesheet,
    }));

  return api;
};