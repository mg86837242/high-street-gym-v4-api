import { Router } from 'express';
import { emptyObjSchema, idSchema } from '../schemas/params.js';
import { addressSchema, updateAddressSchema } from '../schemas/addresses.js';
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
import permit from '../middleware/authorization.js';

const addressController = Router();

// Read Address
addressController.get('/', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const result = await emptyObjSchema.spa(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
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
    const result = await idSchema.spa(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const id = result.data;

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
    const result = await addressSchema.spa(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const { lineOne, lineTwo, suburb, postcode, state, country } = result.data;

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
    const result = await updateAddressSchema.spa({
      params: req.params,
      body: req.body,
    });
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const {
      params: { id },
      body: { lineOne, lineTwo, suburb, postcode, state, country },
    } = result.data;

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
    const result = await updateAddressSchema.spa({
      params: req.params,
      body: req.body,
    });
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const {
      params: { admin_id: adminId },
      body: { lineOne, lineTwo, suburb, postcode, state, country },
    } = result.data;

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
    const result = await updateAddressSchema.spa({
      params: req.params,
      body: req.body,
    });
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const {
      params: { trainer_id: trainerId },
      body: { lineOne, lineTwo, suburb, postcode, state, country },
    } = result.data;

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
    const result = await updateAddressSchema.spa({
      params: req.params,
      body: req.body,
    });
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const {
      params: { member_id: memberId },
      body: { lineOne, lineTwo, suburb, postcode, state, country },
    } = result.data;

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
    const result = await idSchema.spa(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: JSON.stringify(result.error.flatten()),
      });
    }
    const id = result.data;

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
