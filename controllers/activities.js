import { Router } from 'express';
import { emptyObjSchema, idSchema } from '../schemas/params.js';
import activitySchema from '../schemas/activities.js';
import {
  getAllActivities,
  getActivitiesById,
  createActivity,
  updateActivityById,
  deleteActivityById,
} from '../models/activities.js';
import permit from '../middleware/rbac.js';
import upload from '../middleware/multer.js';
import { XMLParser } from 'fast-xml-parser';

const activityController = Router();

// Read Activity
activityController.get(
  '/activities',
  // permit('Admin', 'Trainer', 'Member'),
  async (req, res) => {
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
      return res.status(500).json({
        status: 500,
        message: 'Database or server error',
        error,
      });
    }
  }
);

activityController.get('/activities/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
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
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Create Activity
activityController.post('/activities', permit('Admin', 'Trainer'), async (req, res) => {
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
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

activityController.post(
  '/activities/upload/xml',
  upload.single('xml'),
  // permit('Admin', 'Trainer'),
  async (req, res) => {
    try {
      const xmlStr = req?.file?.buffer?.toString();
      const parser = new XMLParser();
      const {
        activityList: { activity: activities },
      } = parser.parse(xmlStr);
      // FIX insert into DB, re-enable rbac after done

      return res.status(200).json({
        status: 200,
        message: 'Activity successfully created',
        // insertId,
      });
    } catch (error) {
      console.log('🟠');
      console.log(error);
      console.log('🟠');
      return res.status(500).json({
        status: 500,
        message: 'Database or server error',
        error,
      });
    }
  }
);

// Update Activity
activityController.patch('/activities/:id', permit('Admin', 'Trainer'), async (req, res) => {
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
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Delete Activity
activityController.delete('/activities/:id', permit('Admin', 'Trainer'), async (req, res) => {
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
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

export default activityController;
