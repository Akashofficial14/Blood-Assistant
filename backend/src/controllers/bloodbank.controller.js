const BloodBankModel = require("../models/bloodBank.model");
const RequestModel = require("../models/request.model");
const customError = require("../utills/customError");
const { formatTime } = require("../utills/formatTime");

const {
  success,
  notFound,
  badRequest,
  updated,
  internalError,
} = require("../utills/response.utill");

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

module.exports = {
  getInventory,
  updateInventory,
  getRequests,
  acceptRequest,
  rejectRequest,
};
