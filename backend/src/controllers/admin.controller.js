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

const rejectBank = async (req, res, next) => {
    try {
        // 1. Update the Blood Bank Status to Rejected
        const updatedBank = await bloodbankModel.findByIdAndUpdate(
            req.params.bankId,
            { "verificationStatus.status": "rejected", "verificationStatus.rejectedAt": Date.now() },
            { new: true }
        );
        if (!updatedBank) {
            throw new customError("Blood bank not found", 404);
        }

        // 2. Update the Owner (User) Link and Status
        await userModel.findByIdAndUpdate(updatedBank.owner, {
            bloodBankId: null, // This ensures it's set to null
            "ownershipStatus.status": "rejected",
            "ownershipStatus.rejectedAt": Date.now()
        });

        return responseUtil.updated(res, { bank: updatedBank }, "Bank and User updated successfully!");
    } catch (error) {
        return next(error);
    }
};

const getProfileController = async (req, res, next) => {
    try {
        // req.user._id is populated by your protect/auth middleware
        const userId = req.user?._id;

        if (!userId) {
            throw new customError("Unauthorized: No user ID found", 401);
        }

        // Fetch the user from DB (excluding sensitive fields like password)
        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            throw new customError("User not found", 404);
        }

        // Using your response utility to return the data
        return responseUtil.success(
            res,
            { user },
            "User profile fetched successfully"
        );
    } catch (error) {
        // Pass error to your global error handler
        return next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        // Filter directly in the query: find users where isVerified is true
        const users = await userModel.find({ isVerified: true }).select("-password");

        // Check if the array is empty
        if (!users || users.length === 0) {
            throw new customError("No verified users found", 404);
        }

        return responseUtil.success(res, { users }, "Verified users fetched successfully");
    } catch (error) {
        return next(error);
    }
};

const changeUserRoleController = async (req, res, next) => {
    let { userIds, newRole } = req.body;

    try {
        if (!userIds || !newRole) {
            throw new customError("User IDs and new role are required", 400);
        }

        const idsToUpdate = Array.isArray(userIds) ? userIds : [userIds];

        // 1. Perform the update
        const result = await userModel.updateMany(
            { _id: { $in: idsToUpdate } },
            { $set: { userRole: newRole } }
        );

        // 2. Fetch the data of the users that were actually modified
        // We fetch by ID and the newRole to ensure we only get the ones that match our update
        const updatedUsers = await userModel.find(
            { _id: { $in: idsToUpdate }, userRole: newRole },
            "name email userRole" // Only select the fields you need for the response
        );

        return responseUtil.success(
            res, 
            { 
                count: result.modifiedCount,
                updatedUsers: updatedUsers // This will be the list of user objects
            }, 
            `${result.modifiedCount} user roles updated successfully`
        );
    } catch (error) {
        return next(error);
    }
};

module.exports = { verifyBank, getProfileController, getAllUsers, changeUserRoleController, rejectBank }