const BloodBankModel = require("../models/bloodBank.model");
const donationModel = require("../models/donateblood.model");
const RequestModel = require("../models/request.model");
const customError = require("../utills/customError");
const { formatTime } = require("../utills/formatTime");

const {
  success,
  notFound,
  badRequest,
  updated,
  internalError,
  created,
} = require("../utills/response.utill");

const registerBloodBank = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, organizationType, registrationDetails, contact, address } =
      req.body;

    if (!name || !organizationType) {
      return badRequest(res, {}, "Basic information missing");
    }

    if (
      !registrationDetails?.licenseNumber ||
      !registrationDetails?.licenseValidity
    ) {
      return badRequest(res, {}, "License details required");
    }

    if (!contact?.email || !contact?.phone) {
      return badRequest(res, {}, "Contact details required");
    }

    if (!address?.city || !address?.state || !address?.zipCode) {
      return badRequest(res, {}, "Address details required");
    }

    const existing = await BloodBankModel.findOne({ owner: userId });

    if (existing) {
      return badRequest(res, {}, "Blood bank already registered for this user");
    }

    let location = {
      type: "Point",
      coordinates: [0, 0],
    };

    if (address?.location?.coordinates?.length === 2) {
      location.coordinates = address.location.coordinates;
    }

    const bloodBank = await BloodBankModel.create({
      owner: userId,

      name,
      organizationType,

      registrationDetails: {
        licenseNumber: registrationDetails.licenseNumber,
        licenseValidity: registrationDetails.licenseValidity,
        licenseDocUrl: registrationDetails.licenseDocUrl,
      },

      contact: {
        email: contact.email,
        phone: contact.phone,
        emergencyContact: contact.emergencyContact,
        website: contact.website,
      },

      address: {
        street: address.street,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        location,
      },

      bloodAvailability: [],

      isOpen247: true,
      verificationStatus: {
        status: "pending",
      },
    });

    // const responseData = {
    //   id: bloodBank._id,
    //   name: bloodBank.name,
    //   status: bloodBank.verificationStatus.status,
    // };

    return created(res, bloodBank, "Blood bank registered successfully");
  } catch (err) {
    console.error("REGISTER BLOODBANK ERROR:", err);
    return internalError(res, {}, "Failed to register blood bank");
  }
};

const getInventory = async (req, res) => {
  try {
    const userId = req.user.id;

    const bloodBank = await BloodBankModel.findOne({ owner: userId });

    if (!bloodBank) {
      return notFound(res, {}, "Blood bank not found");
    }

    const allGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const inventoryMap = {};
    bloodBank.bloodAvailability.forEach((item) => {
      inventoryMap[item.group] = {
        units: item.unitsAvailable,
        lastUpdated: item.lastUpdated,
      };
    });

    const inventory = allGroups.map((group) => ({
      group,
      units: inventoryMap[group]?.units || 0,
      lastUpdated: inventoryMap[group]?.lastUpdated || null,
    }));

    const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);

    const lowStock = inventory.filter((item) => item.units <= 5);

    return success(
      res,
      {
        inventory,
        stats: {
          totalUnits,
          lowStockCount: lowStock.length,
        },
      },
      "Inventory fetched successfully",
    );
  } catch (err) {
    console.error("GET INVENTORY ERROR:", err);
    return internalError(res, {}, "Failed to fetch inventory");
  }
};

const updateInventory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { group, units } = req.body;

    const validGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    if (!group || units === undefined) {
      return badRequest(res, {}, "Blood group and units are required");
    }

    if (!validGroups.includes(group)) {
      return badRequest(res, {}, "Invalid blood group");
    }

    if (units < 0) {
      return badRequest(res, {}, "Units cannot be negative");
    }

    const bloodBank = await BloodBankModel.findOne({ owner: userId });

    if (!bloodBank) {
      return notFound(res, {}, "Blood bank not found");
    }

    let existingGroup = bloodBank.bloodAvailability.find(
      (item) => item.group === group,
    );

    if (existingGroup) {
      existingGroup.unitsAvailable = units;
      existingGroup.lastUpdated = new Date();
    } else {
      bloodBank.bloodAvailability.push({
        group,
        unitsAvailable: units,
        lastUpdated: new Date(),
      });
    }

    await bloodBank.save();

    const allGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const inventoryMap = {};
    bloodBank.bloodAvailability.forEach((item) => {
      inventoryMap[item.group] = {
        units: item.unitsAvailable,
        lastUpdated: item.lastUpdated,
      };
    });

    const inventory = allGroups.map((group) => ({
      group,
      units: inventoryMap[group]?.units || 0,
      lastUpdated: inventoryMap[group]?.lastUpdated || null,
    }));

    const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);

    return updated(
      res,
      {
        inventory,
        stats: {
          totalUnits,
        },
      },
      `${group} inventory updated successfully`,
    );
  } catch (err) {
    console.error("UPDATE INVENTORY ERROR:", err);
    return internalError(res, {}, "Failed to update inventory");
  }
};

const getBloodbankDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const bloodBank = await BloodBankModel.findOne({ owner: userId });

    if (!bloodBank) {
      return notFound(res, {}, "Blood bank not found");
    }

    const data = {
      name: bloodBank.name,
      organizationType: bloodBank.organizationType,

      licenseNumber: bloodBank.registrationDetails?.licenseNumber,
      licenseValidity: bloodBank.registrationDetails?.licenseValidity,

      verificationStatus: bloodBank.verificationStatus?.status,

      email: bloodBank.contact?.email,
      phone: bloodBank.contact?.phone,
      emergencyContact: bloodBank.contact?.emergencyContact,
      website: bloodBank.contact?.website,

      city: bloodBank.address?.city,
      state: bloodBank.address?.state,
      zip: bloodBank.address?.zipCode,

      isOpen247: bloodBank.isOpen247,
    };

    return success(
      res,
      { profile: data },
      "Blood bank details fetched successfully",
    );
  } catch (err) {
    console.error("GET BLOODBANK DETAILS ERROR:", err);
    return internalError(res, {}, "Failed to fetch details");
  }
};

const updateBloodBankDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const { contact, address, isOpen247 } = req.body;

    const bloodBank = await BloodBankModel.findOne({ owner: userId });

    if (!bloodBank) {
      return notFound(res, {}, "Blood bank not found");
    }

    if (
      req.body.registrationDetails ||
      req.body.verificationStatus ||
      req.body.name ||
      req.body.organizationType
    ) {
      return badRequest(
        res,
        {},
        "You are not allowed to update restricted fields",
      );
    }

    if (contact) {
      if (contact.email) bloodBank.contact.email = contact.email;
      if (contact.phone) bloodBank.contact.phone = contact.phone;
      if (contact.emergencyContact)
        bloodBank.contact.emergencyContact = contact.emergencyContact;
      if (contact.website) bloodBank.contact.website = contact.website;
    }

    if (address) {
      if (address.city) bloodBank.address.city = address.city;
      if (address.state) bloodBank.address.state = address.state;
      if (address.zipCode) bloodBank.address.zipCode = address.zipCode;
      if (address.street) bloodBank.address.street = address.street;
      if (address.landmark) bloodBank.address.landmark = address.landmark;
    }

    if (typeof isOpen247 === "boolean") {
      bloodBank.isOpen247 = isOpen247;
    }

    await bloodBank.save();

    return updated(res, {}, "Blood bank details updated successfully");
  } catch (err) {
    console.error("UPDATE BLOODBANK ERROR:", err);
    return internalError(res, {}, "Failed to update details");
  }
};

const getRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const bloodBank = await BloodBankModel.findOne({ owner: userId });

    if (!bloodBank) {
      return notFound(res, {}, "Blood bank not found");
    }

    const requests = await Request.find({
      bloodBank: bloodBank._id,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map((req) => ({
      id: req._id,
      name: req.user?.name || "Unknown",
      blood: req.bloodGroup,
      units: req.units,
      status: req.status,
      time: formatTime(req.createdAt),
    }));

    return success(
      res,
      { requests: formattedRequests },
      "Requests fetched successfully",
    );
  } catch (err) {
    console.error("GET REQUESTS ERROR:", err);
    return internalError(res, {}, "Failed to fetch requests");
  }
};

const acceptRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.id;

    const bloodBank = await BloodBankModel.findOne({ owner: userId });

    if (!bloodBank) {
      return notFound(res, {}, "Blood bank not found");
    }

    const request = await RequestModel.findById(requestId);

    if (!request) {
      return notFound(res, {}, "Request not found");
    }

    if (request.bloodBank.toString() !== bloodBank._id.toString()) {
      return badRequest(res, {}, "Unauthorized request access");
    }

    if (request.status !== "pending") {
      return badRequest(res, {}, "Request already processed");
    }

    const bloodGroupData = bloodBank.bloodAvailability.find(
      (item) => item.group === request.bloodGroup,
    );

    if (!bloodGroupData) {
      return badRequest(res, {}, "Blood group not available in inventory");
    }

    if (bloodGroupData.unitsAvailable < request.units) {
      return badRequest(res, {}, "Insufficient blood units");
    }

    bloodGroupData.unitsAvailable -= request.units;
    bloodGroupData.lastUpdated = new Date();

    request.status = "accepted";

    await bloodBank.save();
    await request.save();

    return success(
      res,
      {
        requestId: request._id,
        status: request.status,
        remainingUnits: bloodGroupData.unitsAvailable,
      },
      "Request accepted successfully",
    );
  } catch (err) {
    console.error("ACCEPT REQUEST ERROR:", err);
    return internalError(res, {}, "Failed to accept request");
  }
};

const rejectRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.id;

    const bloodBank = await BloodBankModel.findOne({ owner: userId });

    if (!bloodBank) {
      return notFound(res, {}, "Blood bank not found");
    }

    const request = await RequestModel.findById(requestId);

    if (!request) {
      return notFound(res, {}, "Request not found");
    }

    if (request.bloodBank.toString() !== bloodBank._id.toString()) {
      return badRequest(res, {}, "Unauthorized request access");
    }

    if (request.status !== "pending") {
      return badRequest(res, {}, "Request already processed");
    }

    request.status = "rejected";

    await request.save();

    return success(
      res,
      {
        requestId: request._id,
        status: request.status,
      },
      "Request rejected successfully",
    );
  } catch (err) {
    console.error("REJECT REQUEST ERROR:", err);
    return internalError(res, {}, "Failed to reject request");
  }
};

const getRegisteredDonors = async (req, res, next) => {
  try {
    const { bloodBankId } = req.params;

    if (!bloodBankId) {
      throw new customError("Blood bank ID is required", 400);
    }

    /**
     * We query the Donation collection where bloodBank matches the ID.
     * Then we populate the 'user' field to get the account details.
     */
    const allDonations = await donationModel.find({ bloodBank: bloodBankId })
      // .populate("user", "-password") // Get user details but hide password
      // .populate("bloodBank", "name contact address") // Optional: Get bank context
      .sort({ createdAt: -1 }); // Show most recent registrations first

    // allDonations is now an array of objects containing donorInfo, appointment, contact, and user
    return success(
      res,
      { 
        count: allDonations.length,
        donors: allDonations 
      },
      "All donor registration details fetched successfully"
    );

  } catch (err) {
    console.error("GET REGISTERED DONORS ERROR:", err);
    return next(err); 
  }
};

module.exports = {
  getInventory,
  updateInventory,
  getRequests,
  acceptRequest,
  rejectRequest,
  registerBloodBank,
  getBloodbankDetails,
  updateBloodBankDetails,
  getRegisteredDonors,
};