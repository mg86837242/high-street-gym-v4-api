import { Router } from 'express';
import { emptyObjSchema, idSchema } from '../schemas/params.js';
import { addressSchema } from '../schemas/addresses.js';
import {
  getAllAddresses,
  getAddressesById,
  createAddress,
  updateAddressById,
  deleteAddressById,
} from '../models/addresses.js';
import { getAdminsAddressesIdById } from '../models/admins.js';
import { getTrainersAddressesIdById } from '../models/trainers.js';
import { getMembersAddressesIdById } from '../models/members.js';
import permit from '../middleware/rbac.js';

const addressController = Router();

// Read Address
addressController.get('/', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    // FIXME Refactor by using zod's spa(), or by functional approach - using helper functions to abstract the
    //  validation process (but this functional approach requires to define schema for Express request object,
    //  incl. both params and body, which is too much work), extending to other endpoints
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(emptyObjSchema.safeParse(req.body).error.flatten()),
      });
    }
    const [addressResults] = await getAllAddresses();

    return res.status(200).json({
      status: 200,
      message: 'Address records successfully retrieved',
      addresses: addressResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

addressController.get('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(idSchema.safeParse(id).error.flatten()),
      });
    }
    const [[firstAddressResult]] = await getAddressesById(id);

    if (!firstAddressResult) {
      return res.status(404).json({
        status: 404,
        message: 'No addresses found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Address record successfully retrieved',
      address: firstAddressResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Create Address
addressController.post('/', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    if (!addressSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(addressSchema.safeParse(req.body).error.flatten()),
      });
    }
    const { lineOne, lineTwo, suburb, postcode, state, country } = req.body;

    const [{ insertId }] = await createAddress(lineOne, lineTwo, suburb, postcode, state, country);

    return res.status(200).json({
      status: 200,
      message: 'Address successfully created',
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

// Update Address
addressController.patch('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(idSchema.safeParse(id).error.flatten()),
      });
    }
    if (!addressSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(addressSchema.safeParse(req.body).error.flatten()),
      });
    }
    const { lineOne, lineTwo, suburb, postcode, state, country } = req.body;

    const [{ affectedRows }] = await updateAddressById(id, lineOne, lineTwo, suburb, postcode, state, country);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No addresses found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Address successfully updated',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

addressController.patch('/by/admin_id/:admin_id', permit('Admin'), async (req, res) => {
  try {
    const { admin_id: adminId } = req.params.admin_id;
    if (!idSchema.safeParse(adminId).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(idSchema.safeParse(adminId).error.flatten()),
      });
    }
    if (!addressSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(addressSchema.safeParse(req.body).error.flatten()),
      });
    }
    const { lineOne, lineTwo, suburb, postcode, state, country } = req.body;

    const [[{ addressId }]] = await getAdminsAddressesIdById(adminId);
    const [{ affectedRows }] = await updateAddressById(addressId, lineOne, lineTwo, suburb, postcode, state, country);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No addresses found with the ID provided',
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Address successfully updated',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

addressController.patch('/by/trainer_id/:trainer_id', permit('Admin', 'Trainer'), async (req, res) => {
  try {
    const { trainer_id: trainerId } = req.params;
    if (!idSchema.safeParse(trainerId).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(idSchema.safeParse(trainerId).error.flatten()),
      });
    }
    if (!addressSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(addressSchema.safeParse(req.body).error.flatten()),
      });
    }
    const { lineOne, lineTwo, suburb, postcode, state, country } = req.body;

    const [[{ addressId }]] = await getTrainersAddressesIdById(trainerId);
    const [{ affectedRows }] = await updateAddressById(addressId, lineOne, lineTwo, suburb, postcode, state, country);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No addresses found with the ID provided',
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Address successfully updated',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

addressController.patch('/by/member_id/:member_id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { member_id: memberId } = req.params;
    if (!idSchema.safeParse(memberId).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(idSchema.safeParse(memberId).error.flatten()),
      });
    }
    if (!addressSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(addressSchema.safeParse(req.body).error.flatten()),
      });
    }
    const { lineOne, lineTwo, suburb, postcode, state, country } = req.body;

    const [[{ addressId }]] = await getMembersAddressesIdById(memberId);
    const [{ affectedRows }] = await updateAddressById(addressId, lineOne, lineTwo, suburb, postcode, state, country);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No addresses found with the ID provided',
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Address successfully updated',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

// Delete Address
addressController.delete('/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(idSchema.safeParse(id).error.flatten()),
      });
    }
    const [{ affectedRows }] = await deleteAddressById(id);

    if (!affectedRows) {
      return res.status(404).json({
        status: 404,
        message: 'No addresses found with the ID provided',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Address successfully deleted',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
    });
  }
});

export default addressController;
