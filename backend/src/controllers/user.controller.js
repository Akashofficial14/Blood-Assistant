const BloodBankModel = require("../models/bloodbank.model");
const donationModel = require("../models/donateblood.model");
const customError = require("../utills/customError");
const responseUtil = require("../utills/response.utill");

const saveDonorRequestInBloodBankController = async (req, res, next) => {
    try {
        const { bloodBankId } = req.params;

        if (!bloodBankId) {
            throw new customError("Blood bank ID is required", 400);
        }

        const bloodBank = await BloodBankModel.findById(bloodBankId);

        if (!bloodBank) {
            throw new customError("Blood bank not found", 404);
        }

        // ✅ create donation (MAIN DATA STORAGE)
        const donation = await donationModel.create({
            user: req.user._id, // 🔥 requires auth middleware
            bloodBank: bloodBankId,
            ...req.body
        });

        // ✅ store reference in blood bank
        bloodBank.registeredDonors.push(donation._id);
        await bloodBank.save();

        return responseUtil.success(
            res,
            { donation },
            "Donor request saved successfully"
        );

    } catch (error) {
        return next(error);
    }
};

module.exports = {
    saveDonorRequestInBloodBankController,
};