const express=require('express')
const { bloodBankRegistrationController ,getBloodBankController,updateBloodBankController} = require('../controllers/bloodBankOwner.contoller')
const authMiddleware = require('../middlewares/auth.middleware')
const router=express.Router()
router.post("/register", authMiddleware, bloodBankRegistrationController)
router.get("/getbloodbank", authMiddleware, getBloodBankController)
router.patch("/updatebloodbank", authMiddleware, updateBloodBankController)
module.exports=router