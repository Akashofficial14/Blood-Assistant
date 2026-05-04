const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const bloodbankController = require("../controllers/bloodbank.controller.js");

const router = Router();

router.post("/register", authMiddleware, bloodbankController.registerBloodBank);

router.get("/inventory", authMiddleware, bloodbankController.getInventory);

router.put("/inventory", authMiddleware, bloodbankController.updateInventory);

router.get("/requests", authMiddleware, bloodbankController.getRequests);

router.get("/details", authMiddleware, bloodbankController.getBloodbankDetails);

router.get("/donor-details/:bloodBankId", authMiddleware, bloodbankController.getRegisteredDonors);

router.put(
  "/update/details",
  authMiddleware,
  bloodbankController.updateBloodBankDetails,
);

router.patch(
  "/requests/:id/accept",
  authMiddleware,
  bloodbankController.acceptRequest,
);

router.patch(
  "/requests/:id/reject",
  authMiddleware,
  bloodbankController.rejectRequest,
);

module.exports = router;
