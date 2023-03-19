import fs from 'node:fs';
import ejs from 'ejs';
import { Router } from 'express';
import { emptyObjSchema } from '../schemas/index.js';
import { getAllMembers, getMembersById } from '../models/members.js';
import { getAddressesById } from '../models/addresses.js';
import { getAllActivities } from '../models/activities.js';
import { getBookingsByActivityId } from '../models/bookings.js';
import { getTrainersById } from '../models/trainers.js';

const exportController = Router();

exportController.get('/member-list', async (req, res) => {
  try {
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: emptyObjSchema.safeParse(req.body).error.issues,
      });
    }
    // Build an array of member objects from relational data
    const [members] = await getAllMembers();
    // NB Use `async` within `map()`: https://stackoverflow.com/questions/42489918/async-await-inside-arrow-functions-arraymap-filter;
    //  alternatively, use `for await...of`, which has better performance, however, forbade by the linting rule
    const mapMemberPromises = members.map(async (m) => {
      // Append an address object as the value to the `address` key for each member object
      const [[address]] = await getAddressesById(m.addressId);
      // NB Error: `Assignment to property of function parameter 'm'` => Solution: (1) declare a new constant, and (2)
      //  use spread syntax in object literals `{...}`, the combination of which will create a shallow clone and avoid
      //  mutation, see MDN's article for explanation
      const appendedM = { ...m, address };
      return appendedM;
    });
    const appendedMembers = await Promise.all(mapMemberPromises);

    // Generate XML document using template
    const xml = ejs.render(fs.readFileSync('api/xml/member-list.xml.ejs').toString(), { members: appendedMembers });

    // Send XML as download
    return res
      .status(200)
      .header('Content-Disposition', 'attachment; filename="member-list-export-xml"')
      .header('Content-Type', 'application/xml')
      .send(xml);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

exportController.get('/activity-list', async (req, res) => {
  try {
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: emptyObjSchema.safeParse(req.body).error.issues,
      });
    }
    // Build an array of activity objects from relational data
    const [activities] = await getAllActivities();
    const mapActivityPromises = activities.map(async (a) => {
      // Append an array of booking object(s) as the value to the `bookings` key for each activity object
      const [bookings] = await getBookingsByActivityId(a.id);
      const mapBookingPromises = bookings.map(async (b) => {
        // Append a member object as the value to the `member` key for each booking object
        const [[member]] = await getMembersById(b.memberId);
        // Append a trainer  object as the value to the `trainer` key for each booking object
        const [[trainer]] = await getTrainersById(b.trainerId);
        const appendedB = { ...b, member, trainer };
        return appendedB;
      });
      const appendedBookings = await Promise.all(mapBookingPromises);
      const appendedA = { ...a, bookings: appendedBookings };
      return appendedA;
    });
    const appendedActivities = await Promise.all(mapActivityPromises);

    // Generate XML document using template
    const xml = ejs.render(fs.readFileSync('api/xml/activity-list.xml.ejs').toString(), {
      activities: appendedActivities,
    });

    // Send XML as download
    return res
      .status(200)
      .header('Content-Disposition', 'attachment; filename="activity-list-export-xml"')
      .header('Content-Type', 'application/xml')
      .send(xml);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

export default exportController;
