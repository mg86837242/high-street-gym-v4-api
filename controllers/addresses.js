import { Router } from 'express';
import { emptyObjSchema, idSchema } from '../schemas/index.js';
import addressSchema from '../schemas/addresses.js';
import {
  getAllAddresses,
  getAddressesById,
  getAddressesByDetails,
  createAddress,
  updateAddressById,
  deleteAddressById,
} from '../models/addresses.js';
import { getMembersAddressesIdByMemberId } from '../models/members.js';
import permit from '../middleware/rbac.js';

const addressController = Router();

// Read Address
addressController.get('/addresses', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    if (!emptyObjSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: emptyObjSchema.safeParse(req.body).error.issues,
      });
    }
    const [addressResults] = await getAllAddresses();

    return res.status(200).json({
      status: 200,
      message: 'Address records successfully retrieved',
      addresses: addressResults,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

addressController.get('/addresses/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
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
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Create Address
addressController.post('/addresses', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { lineOne, lineTwo, suburb, postcode, state, country } = req.body;

    const [{ insertId }] = await createAddress(lineOne, lineTwo, suburb, postcode, state, country);

    res.status(200).json({
      status: 200,
      message: 'Address successfully created',
      insertId,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Update Address
addressController.patch('/addresses/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
      });
    }
    if (!addressSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: addressSchema.safeParse(req.body).error.issues,
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
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

addressController.patch('/addresses/by-memberid/:memberid', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { memberid: memberId } = req.params;
    if (!idSchema.safeParse(memberId).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(memberId).error.issues,
      });
    }
    if (!addressSchema.safeParse(req.body).success) {
      return res.status(400).json({
        status: 400,
        message: addressSchema.safeParse(req.body).error.issues,
      });
    }
    const { lineOne, lineTwo, suburb, postcode, state, country } = req.body;

    // Find if there's duplicate address row
    let [[{ addressId: id }]] = await getMembersAddressesIdByMemberId(memberId);
    const [[addressExists]] = await getAddressesByDetails(lineOne, lineTwo, suburb, postcode, state, country);
    if (addressExists) {
      // -- Use the found address row's PK if exists
      id = addressExists.id;
    } else {
      // -- Update address row if NOT exists
      const [{ affectedRows }] = await updateAddressById(id, lineOne, lineTwo, suburb, postcode, state, country);

      if (!affectedRows) {
        return res.status(404).json({
          status: 404,
          message: 'No addresses found with the ID provided',
        });
      }
    }

    return res.status(200).json({
      status: 200,
      message: 'Address successfully updated',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

// Delete Address
addressController.delete('/addresses/:id', permit('Admin', 'Trainer', 'Member'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!idSchema.safeParse(id).success) {
      return res.status(400).json({
        status: 400,
        message: idSchema.safeParse(id).error.issues,
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
    return res.status(500).json({
      status: 500,
      message: 'Database or server error',
      error,
    });
  }
});

export default addressController;
