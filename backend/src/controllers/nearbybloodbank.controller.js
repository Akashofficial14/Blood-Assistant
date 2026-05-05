// ============================================================
// FILE: backend/src/controllers/nearbyBloodBanks.controller.js
// YE FILE BANANA HAI — NAYI FILE HAI
// ============================================================
const BloodBankModel = require("../models/bloodbank.model");
const { success, badRequest, internalError } = require("../utills/response.utill");

/**
 * GET /api/bloodbanks/nearby
 * Query params:
 *   latitude  — user ki current latitude
 *   longitude — user ki current longitude
 *   radius    — km mein (default 10)
 *   bloodGroup — optional filter e.g. "A+" (default "All")
 */
const getNearbyBloodBanks = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, bloodGroup } = req.query;

    // Validate karo ki lat/lng aaye hain
    if (!latitude || !longitude) {
      return badRequest(res, {}, "latitude aur longitude required hain");
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusInMeters = parseFloat(radius) * 1000; // km → meters

    if (isNaN(lat) || isNaN(lng)) {
      return badRequest(res, {}, "Invalid latitude/longitude values");
    }

    // MongoDB $geoNear query — 2dsphere index use hoga
    const query = {
      "address.location": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat], // GeoJSON: [longitude, latitude]
          },
          $maxDistance: radiusInMeters,
        },
      },
      "verificationStatus.status": "verified", // Sirf verified banks dikhao
    };

    // Blood group filter — agar "All" nahi aaya toh
    if (bloodGroup && bloodGroup !== "All") {
      query["bloodAvailability"] = {
        $elemMatch: {
          group: bloodGroup,
          unitsAvailable: { $gt: 0 }, // Sirf available dikhao
        },
      };
    }

    const bloodBanks = await BloodBankModel.find(query)
      .select(
        "name organizationType contact address bloodAvailability isOpen247 verificationStatus"
      )
      .limit(20); // Max 20 results

    // Distance calculate karo har bank ke liye
    const banksWithDistance = bloodBanks.map((bank) => {
      const bankLng = bank.address?.location?.coordinates?.[0] || 0;
      const bankLat = bank.address?.location?.coordinates?.[1] || 0;

      // Haversine formula se distance calculate
      const distanceKm = getDistanceKm(lat, lng, bankLat, bankLng);

      // Stock format karo frontend ke liye
      const stock = bank.bloodAvailability.map((item) => ({
        bloodGroup: item.group,
        unitsAvailable: item.unitsAvailable,
      }));

      return {
        _id: bank._id,
        name: bank.name,
        organizationType: bank.organizationType,
        address: `${bank.address?.street ? bank.address.street + ", " : ""}${bank.address?.city}, ${bank.address?.state}`,
        // Coordinates Google Maps redirect ke liye
        coordinates: {
          lat: bankLat,
          lng: bankLng,
        },
        phone: bank.contact?.phone,
        emergencyContact: bank.contact?.emergencyContact,
        website: bank.contact?.website,
        distance: Math.round(distanceKm * 10) / 10, // 1 decimal tak
        isOpen247: bank.isOpen247,
        timing: bank.isOpen247 ? "24/7" : "Check timings",
        stock,
        verificationStatus: bank.verificationStatus?.status,
        rating: 4.5, // Agar rating system baad mein add karna ho
      };
    });

    // Distance se sort karo — sabse paas wala pehle
    banksWithDistance.sort((a, b) => a.distance - b.distance);

    return success(
      res,
      {
        count: banksWithDistance.length,
        bloodBanks: banksWithDistance,
        userLocation: { lat, lng },
        radiusKm: parseFloat(radius),
      },
      "Nearby blood banks fetched successfully"
    );
  } catch (err) {
    console.error("GET NEARBY BLOODBANKS ERROR:", err);
    return internalError(res, {}, "Failed to fetch nearby blood banks");
  }
};

// ─── Haversine Distance Formula ───────────────────────────────
// Do coordinates ke beech ki distance km mein nikalta hai
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

module.exports = { getNearbyBloodBanks };