import Router from 'express-promise-router';

import permit from '../middleware/authorization.js';
import {
  createAddress,
  deleteAddressById,
  getAddressesById,
  getAllAddresses,
  updateAddressById,
} from '../models/addresses.js';
import { getAdminsAddressesIdById } from '../models/admins.js';
import { getMembersAddressesIdById } from '../models/members.js';
import { getTrainersAddressesIdById } from '../models/trainers.js';
import {
  addressSchema,
  updateAddressByAdminIdSchema,
  updateAddressByMemberIdSchema,
  updateAddressByTrainerIdSchema,
  updateAddressSchema,
} from '../schemas/addresses.js';
import { emptyObjSchema, idSchema } from '../schemas/params.js';

const addressController = new Router();

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

// PS The design of route paths and route parameters follows: https://expressjs.com/en/guide/routing.html
addressController.patch('/admins/:adminId', permit('Admin'), async (req, res) => {
  try {
    const result = await updateAddressByAdminIdSchema.spa({
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
      params: { adminId },
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

addressController.patch('/trainers/:trainerId', permit('Admin', 'Trainer'), async (req, res) => {
  try {
    const result = await updateAddressByTrainerIdSchema.spa({
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
      params: { trainerId },
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

addressController.patch('/members/:memberId', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const result = await updateAddressByMemberIdSchema.spa({
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
      params: { memberId },
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
