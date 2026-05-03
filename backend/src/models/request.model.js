const mongoose = require("mongoose");

// Request.find({ bloodBank })
//   .sort({ urgency: -1, createdAt: -1 });

const requestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBank",
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },

    units: {
      type: Number,
      required: true,
      min: [1, "At least 1 unit is required"],
    },

    patientName: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    note: {
      type: String,
      trim: true,
    },

    urgency: {
      type: String,
      enum: ["normal", "urgent", "critical"],
      default: "normal",
    },

    requiredBy: {
      type: Date,
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    respondedAt: Date,
  },
  {
    timestamps: true,
  },
);

requestSchema.index({ bloodBank: 1, status: 1 });
// requestSchema.index({ bloodBank: 1, urgency: -1, createdAt: -1 });
requestSchema.index({ user: 1 });

const RequestModel = mongoose.model("Request", requestSchema);

module.exports = RequestModel
