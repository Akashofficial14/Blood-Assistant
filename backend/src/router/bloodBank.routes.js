const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const bloodbankController = require("../controllers/bloodbank.controller.js");

const router = Router();

// router.get("/inventory", authMiddleware, bloodbankController.getInventory);

// router.put("/inventory", authMiddleware, bloodbankController.updateInventory);

// router.get("/requests", authMiddleware, bloodbankController.getRequests);

// router.patch(
//   "/requests/:id/accept",
//   authMiddleware,
//   bloodbankController.acceptRequest,
// );

// router.patch(
//   "/requests/:id/reject",
//   authMiddleware,
//   bloodbankController.rejectRequest,
// );

// router.get("/staff", authMiddleware, bloodbankController.getStaff);

// router.post("/staff", authMiddleware, bloodbankController.addStaff);

// router.put("/staff/:id", authMiddleware, bloodbankController.updateStaff);

// router.delete("/staff/:id", authMiddleware, bloodbankController.deleteStaff);

module.exports = router;
