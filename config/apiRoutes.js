import activityController from '../controllers/activities.js';
import addressController from '../controllers/addresses.js';
import blogController from '../controllers/blogs.js';
import bookingController from '../controllers/bookings.js';
import exportController from '../controllers/export.js';
import userController from '../controllers/logins.js';
import memberController from '../controllers/members.js';
import trainerController from '../controllers/trainers.js';
import adminController from '../controllers/admins.js';

export default function (app) {
  // Controller-level middleware – mount the router on the app
  app.use('/api/activities', activityController);
  app.use('/api/addresses', addressController);
  app.use('/api/blogs', blogController);
  app.use('/api/bookings', bookingController);
  app.use('/api/exports', exportController);
  app.use('/api/users', userController);
  app.use('/api/members', memberController);
  app.use('/api/trainers', trainerController);
  app.use('/api/admins', adminController);
}
