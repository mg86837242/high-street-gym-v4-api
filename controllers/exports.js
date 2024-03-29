import ejs from 'ejs';
import Router from 'express-promise-router';
import * as fs from 'node:fs';

import { getAllActivities } from '../models/activities.js';
import { getAddressesById } from '../models/addresses.js';
import { getBookingsByActivityId } from '../models/bookings.js';
import { getAllMembers, getMembersById } from '../models/members.js';
import { getTrainersById } from '../models/trainers.js';
import { emptyObjSchema } from '../schemas/params.js';

const exportController = new Router();

exportController.get('/member_list', async (req, res) => {
  try {
    const result = await emptyObjSchema.spa(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    // Build an array of member objs from relational data
    const [members] = await getAllMembers();
    // NB Use `async` within `map()`: https://stackoverflow.com/questions/42489918/async-await-inside-arrow-functions-arraymap-filter;
    //  alternatively, use `for await...of`, which has better performance, however, forbade by the linting rule
    const mapMemberPromises = members.map(async m => {
      // Append an address obj as the value to the `address` key for each member obj
      const [[address]] = await getAddressesById(m.addressId);
      // NB Error: `Assignment to property of function parameter 'm'` => Solution: (1) declare a new constant, and (2)
      //  use spread syntax in obj literals `{...}`, the combination of which will create a shallow clone and avoid
      //  mutation, see MDN's article for explanation
      return { ...m, address };
    });
    const appendedMembers = await Promise.all(mapMemberPromises);

    // Generate XML document using template
    const xml = ejs.render(fs.readFileSync('api/xml/member-list.xml.ejs').toString(), { members: appendedMembers });

    // Send XML as download
    return res
      .status(200)
      .set('Content-Disposition', 'attachment; filename="member-list-export-xml"')
      .set('Content-Type', 'application/xml')
      .send(xml);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

exportController.get('/activity_list', async (req, res) => {
  try {
    const result = await emptyObjSchema.spa(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    // Build an array of activity objs from relational data
    const [activities] = await getAllActivities();
    const mapActivityPromises = activities.map(async a => {
      // Append an array of booking obj(s) as the value to the `bookings` key for each activity obj
      const [bookings] = await getBookingsByActivityId(a.id);
      const mapBookingPromises = bookings.map(async b => {
        // Append a member obj as the value to the `member` key for each booking obj
        const [[member]] = await getMembersById(b.memberId);
        // Append a trainer  obj as the value to the `trainer` key for each booking obj
        const [[trainer]] = await getTrainersById(b.trainerId);
        return { ...b, member, trainer };
      });
      const appendedBookings = await Promise.all(mapBookingPromises);
      return { ...a, bookings: appendedBookings };
    });
    const appendedActivities = await Promise.all(mapActivityPromises);

    // Generate XML document using template
    const xml = ejs.render(fs.readFileSync('api/xml/activity-list.xml.ejs').toString(), {
      activities: appendedActivities,
    });

    // Send XML as download
    return res
      .status(200)
      .set('Content-Disposition', 'attachment; filename="activity-list-export-xml"')
      .set('Content-Type', 'application/xml')
      .send(xml);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

export default exportController;
