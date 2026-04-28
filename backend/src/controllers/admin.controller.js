const bloodbankModel = require("../models/bloodbank.model");
const userModel = require("../models/user.model");

// Route: PATCH /api/admin/verify-bank/:bankId
const verifyBank = async (req, res) => {
    try {
        // 1. Update the Blood Bank Status
        const updatedBank = await bloodbankModel.findByIdAndUpdate(
            req.params.bankId,
            { "verificationStatus.status": "verified", "verificationStatus.verifiedAt": Date.now() },
            { new: true }
        );

        // 2. Update the Owner (User) Link and Status
        await userModel.findByIdAndUpdate(updatedBank.owner, {
            bloodBankId: updatedBank._id, // This ensures it's no longer null
            "ownershipStatus.status": "verified",
            "ownershipStatus.approvedAt": Date.now()
        });

        res.status(200).json({ message: "Bank and User updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports={verifyBank}