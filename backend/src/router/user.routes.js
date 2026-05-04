const express = require("express");
const { saveDonorRequestInBloodBankController } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router=express.Router()
router.post("/donate/register/:bloodBankId",authMiddleware,saveDonorRequestInBloodBankController)

module.exports=router
