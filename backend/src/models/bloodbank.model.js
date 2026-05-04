const mongoose = require("mongoose");

const bloodBankSchema = new mongoose.Schema(
  {
    // --- Owner Reference ---
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // --- Basic Information ---
    name: {
      type: String,
      required: [true, "Blood bank name is required"],
      trim: true,
    },
    organizationType: {
      type: String,
      enum: [
        "Government",
        "Charitable",
        "Red Cross",
        "Private Hospital",
        "Standalone Private",
      ],
      required: true,
    },

    // --- Regulatory & Verification (Crucial for Admin) ---
    registrationDetails: {
      licenseNumber: {
        type: String,
        required: [true, "Drug License Number is mandatory for verification"],
        unique: true,
        trim: true,
      },
      licenseValidity: {
        type: Date,
        required: [true, "License expiry date is required"],
      },
      licenseDocUrl: {
        type: String, // URL to the PDF stored in AWS S3 or Cloudinary
        required: [true, "A scanned copy of the license must be uploaded"],
      },
    },
    verificationStatus: {
      status: {
        type: String,
        enum: ["pending", "verified", "rejected", "suspended"],
        default: "pending",
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
      verifiedAt: Date,
      rejectionReason: String,
    },

    // --- Location & Contact ---
    contact: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
      },
      phone: {
        type: String,
        required: true,
      },
      emergencyContact: String, // 24/7 helpline
      website: String,
    },
    address: {
      street: String,
      landmark: String,
      city: {
        type: String,
        required: true,
        index: true, // Optimized for city-based searches
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      location: {
        type: { type: String, default: "Point" },
        coordinates: [Number], // [longitude, latitude] for GeoJSON proximity searches
      },
    },

    // --- Inventory & Operations ---
    bloodAvailability: [
      {
        group: {
          type: String,
          enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        unitsAvailable: {
          type: Number,
          default: 0,
        },
        lastUpdated: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    registeredDonors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    isOpen247: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Create a geospatial index for finding nearby blood banks
bloodBankSchema.index({ "address.location": "2dsphere" });

// const BloodBankModel = mongoose.model('BloodBank', bloodBankSchema);

const BloodBankModel =
  mongoose.models.BloodBank || mongoose.model("BloodBank", bloodBankSchema);

module.exports = BloodBankModel;
