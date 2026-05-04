const { default: mongoose } = require("mongoose");

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bloodBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodBank",
    required: true
  },
  donorInfo: {
    fullName: String,
    bloodGroup: String,
    dob: Date,
    gender: String
  },
  appointment: {
    state: String,
    city: String,
    preferredDate: Date,
    timeSlot: String
  },
  contact: {
    phone: String,
    email: String
  }
}, { timestamps: true });

const donationModel = mongoose.model("Donation", donationSchema);
module.exports = donationModel;