const bloodbankModel = require("../models/bloodbank.model");
const userModel = require("../models/user.model");
const customError = require("../utills/customError");
const responseUtil = require("../utills/response.utill");

// Route: PATCH /api/admin/verify-bank/:bankId
const verifyBank = async (req, res, next) => {
    try {
        // 1. Update the Blood Bank Status
        const updatedBank = await bloodbankModel.findByIdAndUpdate(
            req.params.bankId,
            { "verificationStatus.status": "verified", "verificationStatus.verifiedAt": Date.now() },
            { new: true }
        );
        if (!updatedBank) {
            throw new customError("Blood bank not found", 404);
        }

        // 2. Update the Owner (User) Link and Status
        await userModel.findByIdAndUpdate(updatedBank.owner, {
            bloodBankId: updatedBank._id, // This ensures it's no longer null
            "ownershipStatus.status": "verified",
            "ownershipStatus.approvedAt": Date.now()
        });

        return responseUtil.updated(res, { bank: updatedBank }, "Bank and User updated successfully!");
    } catch (error) {
        return next(error);
    }
};

module.exports={verifyBank}