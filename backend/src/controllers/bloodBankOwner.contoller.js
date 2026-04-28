const bloodBankModel = require("../models/bloodbank.model");
const userModel = require("../models/user.model");
const sendMail = require("../services/mail.service");

// Register Blood Bank
const bloodBankRegistrationController = async (req, res) => {
    try {
        const ownerId = req.user._id;
        
        // Check if user role is 'manage_bank'
        const owner = await userModel.findById(ownerId);
        if (!owner || owner.userRole !== 'manage_bank') {
            return res.status(403).json({
                message: "Only bank managers can register a blood bank"
            });
        }

        // Check if owner already has a blood bank
        const existingBloodBank = await bloodBankModel.findOne({ owner: ownerId });
        if (existingBloodBank) {
            return res.status(400).json({
                message: "You already have a registered blood bank"
            });
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
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        if (!registrationDetails.licenseNumber || !registrationDetails.licenseValidity || !registrationDetails.licenseDocUrl) {
            return res.status(400).json({
                message: "License details are required for verification"
            });
        }

        if (!contact.email || !contact.phone) {
            return res.status(400).json({
                message: "Contact email and phone are required"
            });
        }

        if (!address.city || !address.state || !address.zipCode) {
            return res.status(400).json({
                message: "Complete address is required"
            });
        }

        // Check if license number is unique
        const licenseExists = await bloodBankModel.findOne({
            "registrationDetails.licenseNumber": registrationDetails.licenseNumber
        });
        if (licenseExists) {
            return res.status(400).json({
                message: "This license number is already registered"
            });
        }

        // Check if email is unique
        const emailExists = await bloodBankModel.findOne({
            "contact.email": contact.email
        });
        if (emailExists) {
            return res.status(400).json({
                message: "This email is already registered with another blood bank"
            });
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
            return res.status(400).json({
                message: "Failed to create blood bank"
            });
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

        return res.status(201).json({
            success: true,
            message: "Blood bank registered successfully. Awaiting admin verification.",
            bloodBank: newBloodBank
        });

    } catch (error) {
        console.error("Error registering blood bank:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error
        });
    }
};

// Get Blood Bank by Owner
const getBloodBankController = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const bloodBank = await bloodBankModel.findOne({ owner: ownerId }).populate('owner', 'name email');
        
        if (!bloodBank) {
            return res.status(404).json({
                message: "Blood bank not found"
            });
        }

        return res.status(200).json({
            success: true,
            bloodBank
        });
    } catch (error) {
        console.error("Error fetching blood bank:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error
        });
    }
};

// Update Blood Bank (owner can update stock and details)
const updateBloodBankController = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const { bloodAvailability, contact, address, isOpen247 } = req.body;

        const bloodBank = await bloodBankModel.findOne({ owner: ownerId });
        if (!bloodBank) {
            return res.status(404).json({
                message: "Blood bank not found"
            });
        }

        // Check if verified before allowing updates
        if (bloodBank.verificationStatus.status !== 'verified') {
            return res.status(403).json({
                message: "Can only update after admin verification"
            });
        }

        // Update allowed fields
        if (bloodAvailability) bloodBank.bloodAvailability = bloodAvailability;
        if (contact) bloodBank.contact = { ...bloodBank.contact, ...contact };
        if (address) bloodBank.address = { ...bloodBank.address, ...address };
        if (isOpen247 !== undefined) bloodBank.isOpen247 = isOpen247;

        const updatedBloodBank = await bloodBank.save();

        return res.status(200).json({
            success: true,
            message: "Blood bank updated successfully",
            bloodBank: updatedBloodBank
        });
    } catch (error) {
        console.error("Error updating blood bank:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error
        });
    }
};

module.exports = {
    bloodBankRegistrationController,
    getBloodBankController,
    updateBloodBankController
}