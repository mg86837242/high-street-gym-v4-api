import activityController from '../controllers/activities.js';
import addressController from '../controllers/addresses.js';
import blogController from '../controllers/blogs.js';
import bookingController from '../controllers/bookings.js';
import exportController from '../controllers/export.js';
import loginController from '../controllers/logins.js';
import memberController from '../controllers/members.js';
import trainerController from '../controllers/trainers.js';
import adminController from '../controllers/admins.js';

export default function (app) {
  // Controller-level middleware – mount the router on the app
  app.use('/api', activityController);
  app.use('/api', addressController);
  app.use('/api', blogController);
  app.use('/api', bookingController);
  app.use('/api', exportController);
  app.use('/api', loginController);
  app.use('/api', memberController);
  app.use('/api', trainerController);
  app.use('/api', adminController);
}
