// ============================================================
// FILE: backend/src/router/nearbyBloodBanks.routes.js
// YE FILE BANANA HAI — NAYI FILE HAI
// ============================================================

const express = require("express");
const { getNearbyBloodBanks } = require("../controllers/nearbybloodbank.controller");

const router = express.Router();

// Public route — login ki zaroorat nahi (users ko search karne do bina login ke)
// GET /api/bloodbanks/nearby?latitude=23.2599&longitude=77.4126&radius=10&bloodGroup=A+
router.get("/nearby", getNearbyBloodBanks);

module.exports = router;