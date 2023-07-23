import activityController from './activities.js';
import addressController from './addresses.js';
import adminController from './admins.js';
import blogController from './blogs.js';
import bookingController from './bookings.js';
import exportController from './exports.js';
import memberController from './members.js';
import trainerController from './trainers.js';
import userController from './users.js';

export default function (app) {
  // Controller-level middleware – mount the router on the app
  app.use('/api/activities', activityController);
  app.use('/api/addresses', addressController);
  app.use('/api/admins', adminController);
  app.use('/api/blogs', blogController);
  app.use('/api/bookings', bookingController);
  app.use('/api/exports', exportController);
  app.use('/api/members', memberController);
  app.use('/api/trainers', trainerController);
  app.use('/api/users', userController);
}
