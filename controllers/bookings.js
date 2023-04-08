import { Router } from 'express';
import { emptyObjSchema, idSchema, dateSchema } from '../schemas/params.js';
import bookingSchema from '../schemas/bookings.js';
import {
  getAllBookings,
  getBookingsWithDetailsByDate,
  getBookingsWithDetailsById,
  getBookingsById,
  getConflictBookingsByMemberTrainerAndDateTime,
  getSameBookingsByAttrs,
  getConflictBookingsByMemberTrainerAndDateTimeExceptCurr,
  createBooking,
  updateBookingById,
  deleteBookingById,
} from '../models/bookings.js';
import { getAllMembers } from '../models/members.js';
import { getAllTrainers } from '../models/trainers.js';
import { getAllActivities } from '../models/activities.js';
import permit from '../middleware/rbac.js';

const bookingController = Router();

// Read Booking
bookingController.get('/bookings', async (req, res) => {
  try {
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: emptyObjSchema.safeParse(req.body).error.issues,
      });
    }
    const [bookingResults] = await getAllBookings();

    return res.status(200).json({
      status: 200,
      message: 'Booking records successfully retrieved',
      bookings: bookingResults,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

bookingController.get('/bookings/booking-with-details/date/:date', async (req, res) => {
  try {
    // NB `req.params.date` is a string, see: https://reactrouter.com/en/main/start/concepts#route-matches; the data type expected to be used in
    //  the WHERE clause is also a string, however, needs to be formatted like this `YYYY-MM-DD` in the SQL query, this is found out by writing raw
    //  queries in MySQL Workbench
    const { date } = req.params;
    if (!dateSchema.safeParse(date).success) {
      return res.status(400).json({
        status: 400,
        message: dateSchema.safeParse(date).error.issues,
      });
    }
    const [bookingResults] = await getBookingsWithDetailsByDate(date);
    // #region un-foldable
    // NB Bug: query result `bookingResults.dateTime` is in UTC format i/o intended local time format (DATETIME type)
    //  => Culprit: `mysql2` => Solution: add `dateStrings: true` to the connection option (i.e., `pool.js`), see:
    //  -- https://github.com/sidorares/node-mysql2/issues/1089: Issue itself
    //  ---- https://github.com/sidorares/node-mysql2#api-and-configuration: "Check (Node MySQL) API documentation to
    //  see all available API options."
    //  ---- https://github.com/mysqljs/mysql#connection-options: Node MySQL: "`dateStrings`: Force date types
    //  (`TIMESTAMP`, `DATETIME`, `DATE`) to be returned as strings rather than inflated into JavaScript Date objs.
    //  Can be `true`/`false` or an array of type names to keep as strings. (Default: `false`)"
    //  -- https://dev.mysql.com/doc/refman/8.0/en/datetime.html: MySQL converts `TIMESTAMP` values from the current
    //  time zone to UTC for storage, and back from UTC to the current time zone for retrieval. (This does not occur
    //  for other types such as DATETIME.)
    // #endregion

    if (!bookingResults.length) {
      return res.status(404).json({
        status: 404,
        message: 'No booking found with the date provided',
        bookings: bookingResults,
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Booking record successfully retrieved',
      bookings: bookingResults,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

bookingController.get('/bookings/booking-with-details/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [[firstBookingResult]] = await getBookingsWithDetailsById(id);

    if (!firstBookingResult) {
      return res.status(404).json({
        status: 404,
        message: 'No bookings found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Booking record successfully retrieved',
      booking: firstBookingResult,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

bookingController.get('/bookings/booking-with-options/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [[firstBookingResult]] = await getBookingsById(id);

    if (!firstBookingResult) {
      return res.status(404).json({
        status: 404,
        message: 'No bookings found with the ID provided',
      });
    }
    const [memberResults] = await getAllMembers();
    const [trainerResults] = await getAllTrainers();
    const [activityResults] = await getAllActivities();

    return res.status(200).json({
      status: 200,
      message: 'Booking record and options successfully retrieved',
      booking: firstBookingResult,
      members: memberResults,
      trainers: trainerResults,
      activities: activityResults,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

bookingController.get('/bookings/options-only', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: emptyObjSchema.safeParse(req.body).error.issues,
      });
    }
    const [memberResults] = await getAllMembers();
    const [trainerResults] = await getAllTrainers();
    const [activityResults] = await getAllActivities();

    return res.status(200).json({
      status: 200,
      message: 'Booking options successfully retrieved',
      members: memberResults,
      trainers: trainerResults,
      activities: activityResults,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Create Booking
bookingController.post('/bookings', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    if (!bookingSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: bookingSchema.safeParse(req.body).error.issues,
      });
    }
    const { memberId, trainerId, activityId, date, time } = req.body;
    const dateTime = [date, time].join(' ');

    // Find if either of the parties involved is available at given date and time
    const [[isUnavailable]] = await getConflictBookingsByMemberTrainerAndDateTime(memberId, trainerId, dateTime);
    if (isUnavailable) {
      // Find if a same booking already exists
      const [[sameBookingExists]] = await getSameBookingsByAttrs(memberId, trainerId, activityId, dateTime);
      if (sameBookingExists) {
        // -- Return error indicating same booking already exists
        return res.status(409).json({
          status: 409,
          message: 'Same booking record already exists',
        });
      }
      // -- Return error indicating a party involved is unavailable at the given date and time
      return res.status(409).json({
        status: 409,
        message: 'The selected member and/or trainer is not available at the given date and time',
      });
    }
    // -- Create booking row if NEITHER of these exceptions are triggered
    const [{ insertId }] = await createBooking(memberId, trainerId, activityId, dateTime);

    return res.status(200).json({
      status: 200,
      message: 'Booking successfully created',
      insertId,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Update Booking
bookingController.patch('/bookings/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    if (!bookingSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: bookingSchema.safeParse(req.body).error.issues,
      });
    }
    const { memberId, trainerId, activityId, date, time } = req.body;
    const dateTime = [date, time].join(' ');

    // Find if either of the parties involved is available at given date and time
    const [[isUnavailable]] = await getConflictBookingsByMemberTrainerAndDateTimeExceptCurr(
      id,
      memberId,
      trainerId,
      dateTime
    );
    if (isUnavailable) {
      // -- Return error indicating a party involved is unavailable at the given date and time
      return res.status(409).json({
        status: 409,
        message: 'The selected trainer is not available at the given date and time',
      });
    }

    // Find if a same booking already exists
    const [[sameBookingExists]] = await getSameBookingsByAttrs(memberId, trainerId, activityId, dateTime);
    if (sameBookingExists) {
      // -- Skip update if same booking already exists
      return res.status(200).json({
        status: 200,
        message: 'No change to booking has been made',
      });
    }

    const [{ affectedRows }] = await updateBookingById(id, memberId, trainerId, activityId, dateTime);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No bookings found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Booking successfully updated',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Delete Booking
bookingController.delete('/bookings/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [{ affectedRows }] = await deleteBookingById(id);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No bookings found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Booking successfully deleted',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

export default bookingController;
