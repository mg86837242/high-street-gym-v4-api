import { Router } from 'express';
import { XMLParser } from 'fast-xml-parser'; // reason to use `fast-xml-parser` i/o `xml2js`: no need to (1) deep clone or `JSON.parse(JSON.stringify(parsedResult))` to clean up the `[Object null prototype]`, nor (2) tinker `explicitArray` option to explicitly tell the parser to not output the obj value as an array
import pool from '../config/database.js';
import { emptyObjSchema, idSchema } from '../schemas/params.js';
import { activitySchema, activityXMLSchema } from '../schemas/activities.js';
import {
  getAllActivities,
  getActivitiesById,
  createActivity,
  updateActivityById,
  deleteActivityById,
} from '../models/activities.js';
import permit from '../middleware/rbac.js';
import upload from '../middleware/multer.js';

const activityController = Router();

// Read Activity
activityController.get('/', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: emptyObjSchema.safeParse(req.body).error.issues,
      });
    }
    const [activityResults] = await getAllActivities();

    return res.status(200).json({
      status: 200,
      message: 'Activity records successfully retrieved',
      activities: activityResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

activityController.get('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [[firstActivityResult]] = await getActivitiesById(id);

    if (!firstActivityResult) {
      return res.status(404).json({
        status: 404,
        message: 'No activities found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Activity record successfully retrieved',
      activity: firstActivityResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Create Activity
activityController.post('/', permit('Admin', 'Trainer'), async (req, res) => {
  try {
    if (!activitySchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: activitySchema.safeParse(req.body).error.issues,
      });
    }
    const {
      name,
      category,
      description,
      intensityLevel,
      maxPeopleAllowed,
      requirementOne,
      requirementTwo,
      durationMinutes,
      price,
    } = req.body;

    const [{ insertId }] = await createActivity(
      name,
      category,
      description,
      intensityLevel,
      maxPeopleAllowed,
      requirementOne,
      requirementTwo,
      durationMinutes,
      price
    );

    return res.status(200).json({
      status: 200,
      message: 'Activity successfully created',
      insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

activityController.post(
  '/upload/xml',
  upload.single('new-activity-xml'),
  permit('Admin', 'Trainer'),
  async (req, res) => {
    let conn = null;
    try {
      const xmlStr = req?.file?.buffer?.toString();
      const parser = new XMLParser({
        numberParseOptions: {
          leadingZeros: false,
          hex: false,
          eNotation: false,
        },
      });
      const {
        activityList: { activity: activities },
      } = parser.parse(xmlStr);
      // NB After parsing, (1) empty text content within XML Elements becomes empty string, (2) left-out XML Elements
      //  becomes undefined

      const sanitizeActivityPromises = activities.map(async a =>
        Object.keys(a).reduce((acc, cv) => {
          if (a[cv] === '') {
            acc[cv] = null;
          } else {
            acc[cv] = a[cv];
          }
          return acc;
        }, {})
      );
      const sanitizedActivities = await Promise.all(sanitizeActivityPromises);

      const hasInvalid = sanitizedActivities.find(a => !activityXMLSchema.safeParse(a).success);
      if (hasInvalid) {
        console.log(activityXMLSchema.safeParse(hasInvalid).error.issues);
        return res.status(400).json({
          status: 400,
          message: 'Invalid activity record detected',
        });
      }

      // Manually acquire a connection from the pool & start a TRANSACTION
      conn = await pool.getConnection();
      await conn.beginTransaction();

      const createActivityPromises = sanitizedActivities.map(
        async ({
          name,
          category,
          description,
          intensityLevel,
          maxPeopleAllowed,
          requirementOne,
          requirementTwo,
          durationMinutes,
          price,
        }) => {
          await conn.query(
            `
              INSERT INTO Activities
              (name, category, description, intensityLevel, maxPeopleAllowed, requirementOne, requirementTwo, durationMinutes, price)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              name,
              category,
              description,
              intensityLevel,
              maxPeopleAllowed,
              requirementOne,
              requirementTwo,
              durationMinutes,
              price,
            ]
          );
        }
      );
      await Promise.all(createActivityPromises);

      await conn.commit();
      return res.status(200).json({
        status: 200,
        message: 'Activity(-ies) successfully created',
      });
    } catch (error) {
      if (conn) await conn.rollback();
      console.error(error);
      return res.status(500).json({
        status: 500,
        message: 'Database or server error',
      });
    } finally {
      if (conn) conn.release();
    }
  }
);

// Update Activity
activityController.patch('/:id', permit('Admin', 'Trainer'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    if (!activitySchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: activitySchema.safeParse(req.body).error.issues,
      });
    }
    const {
      name,
      category,
      description,
      intensityLevel,
      maxPeopleAllowed,
      requirementOne,
      requirementTwo,
      durationMinutes,
      price,
    } = req.body;

    const [{ affectedRows }] = await updateActivityById(
      id,
      name,
      category,
      description,
      intensityLevel,
      maxPeopleAllowed,
      requirementOne,
      requirementTwo,
      durationMinutes,
      price
    );

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No activities found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Activity successfully updated',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Delete Activity
activityController.delete('/:id', permit('Admin', 'Trainer'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    const [{ affectedRows }] = await deleteActivityById(id);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No activities found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Activity successfully deleted',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

export default activityController;
