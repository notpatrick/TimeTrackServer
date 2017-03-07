import mongoose from 'mongoose';
import credentials from './credentials';

export default (callback) => {
  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://${credentials.name}:${credentials.pw}@${credentials.url}`).then(
    () => {
      console.log('Connected to db');
    },
    (error) => {
      console.log(error);
    },
  );
  callback(mongoose);
};