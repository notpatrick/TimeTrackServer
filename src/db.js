import mongoose from 'mongoose';
import credentials from './credentials';
import Activity from './models/activity.schema';

export default (callback) => {
	// connect to a database if needed, then pass it to `callback`:
	mongoose.connect(`mongodb://${credentials.name}:${credentials.pw}@${credentials.url}`).then(
		() => {
			console.log('Connected to db');
		},
		(error) => {
			console.log(error);
		},
	);
	callback();
};