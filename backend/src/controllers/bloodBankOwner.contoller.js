const bloodBankModel = require("../models/bloodbank.model");
const userModel = require("../models/user.model");
const sendMail = require("../services/mail.service");
const customError = require("../utills/customError");
const responseUtil = require("../utills/response.utill");

// Register Blood Bank
const bloodBankRegistrationController = async (req, res, next) => {
    try {
        const ownerId = req.user._id;
        
        // Check if user role is 'manage_bank'
        const owner = await userModel.findById(ownerId);
        if (!owner || owner.userRole !== 'manage_bank') {
            throw new customError("Only bank managers can register a blood bank", 403);
        }

        // Check if owner already has a blood bank
        const existingBloodBank = await bloodBankModel.findOne({ owner: ownerId });
        if (existingBloodBank) {
            throw new customError("You already have a registered blood bank", 400);
        }

        // Destructure input
        const {
            name,
            organizationType,
            registrationDetails,
            contact,
            address,
            isOpen247
        } = req.body;

        // Validation
        if (!name || !organizationType || !registrationDetails || !contact || !address) {
            throw new customError("All required fields must be provided", 400);
        }

        if (!registrationDetails.licenseNumber || !registrationDetails.licenseValidity || !registrationDetails.licenseDocUrl) {
            throw new customError("License details are required for verification", 400);
        }

        if (!contact.email || !contact.phone) {
            throw new customError("Contact email and phone are required", 400);
        }

        if (!address.city || !address.state || !address.zipCode) {
            throw new customError("Complete address is required", 400);
        }

        // Check if license number is unique
        const licenseExists = await bloodBankModel.findOne({
            "registrationDetails.licenseNumber": registrationDetails.licenseNumber
        });
        if (licenseExists) {
            throw new customError("This license number is already registered", 400);
        }

        // Check if email is unique
        const emailExists = await bloodBankModel.findOne({
            "contact.email": contact.email
        });
        if (emailExists) {
            throw new customError("This email is already registered with another blood bank", 400);
        }

        // Create blood bank
        const newBloodBank = await bloodBankModel.create({
            owner: ownerId,
            name,
            organizationType,
            registrationDetails,
            contact,
            address,
            isOpen247: isOpen247 || true,
            bloodAvailability: [
                { group: 'A+', unitsAvailable: 0 },
                { group: 'A-', unitsAvailable: 0 },
                { group: 'B+', unitsAvailable: 0 },
                { group: 'B-', unitsAvailable: 0 },
                { group: 'AB+', unitsAvailable: 0 },
                { group: 'AB-', unitsAvailable: 0 },
                { group: 'O+', unitsAvailable: 0 },
                { group: 'O-', unitsAvailable: 0 }
            ],
            verificationStatus: {
                status: 'pending'
            }
        });

        if (!newBloodBank) {
            throw new customError("Failed to create blood bank", 400);
        }

        // Update user ownership status
        await userModel.findByIdAndUpdate(
            ownerId,
            {
                $set: {
                    "ownershipStatus.status": "pending",
                    "ownershipStatus.appliedAt": new Date()
                }
            },
            { new: true }
        );

        // Send confirmation email to owner
        const ownerMailContent = `
            <h3>Blood Bank Registration Submitted</h3>
            <p>Your blood bank <strong>${name}</strong> has been successfully registered and is pending admin verification.</p>
            <p><strong>License Number:</strong> ${registrationDetails.licenseNumber}</p>
            <p><strong>Location:</strong> ${address.city}, ${address.state}</p>
            <p>You will receive a confirmation email once the admin verifies your details.</p>
            <p>Thank you for registering with us!</p>
        `;
        
        await sendMail(contact.email, "Blood Bank Registration Submitted", ownerMailContent);

        return responseUtil.created(
            res,
            { bloodBank: newBloodBank },
            "Blood bank registered successfully. Awaiting admin verification.",
        );

    } catch (error) {
        return next(error);
    }
};

// Get Blood Bank by Owner
const getBloodBankController = async (req, res, next) => {
    try {
        const ownerId = req.user._id;
        const bloodBank = await bloodBankModel.findOne({ owner: ownerId }).populate('owner', 'name email');
        
        if (!bloodBank) {
            throw new customError("Blood bank not found", 404);
        }

        return responseUtil.success(res, { bloodBank }, "Blood bank fetched successfully");
    } catch (error) {
        return next(error);
    }
};

// Update Blood Bank (owner can update stock and details)
const updateBloodBankController = async (req, res, next) => {
    try {
        const ownerId = req.user._id;
        const { bloodAvailability, contact, address, isOpen247 } = req.body;

        const bloodBank = await bloodBankModel.findOne({ owner: ownerId });
        if (!bloodBank) {
            throw new customError("Blood bank not found", 404);
        }

        // Check if verified before allowing updates
        if (bloodBank.verificationStatus.status !== 'verified') {
            throw new customError("Can only update after admin verification", 403);
        }

        // Update allowed fields
        if (bloodAvailability) bloodBank.bloodAvailability = bloodAvailability;
        if (contact) bloodBank.contact = { ...bloodBank.contact, ...contact };
        if (address) bloodBank.address = { ...bloodBank.address, ...address };
        if (isOpen247 !== undefined) bloodBank.isOpen247 = isOpen247;

        const updatedBloodBank = await bloodBank.save();

        return responseUtil.updated(
            res,
            { bloodBank: updatedBloodBank },
            "Blood bank updated successfully",
        );
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    bloodBankRegistrationController,
    getBloodBankController,
    updateBloodBankController
}