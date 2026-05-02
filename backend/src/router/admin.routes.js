const express=require('express')
const {verifyBank, getProfileController, getAllUsers} = require('../controllers/admin.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router=express.Router()
router.patch("/verify-bank/:bankId", authMiddleware, verifyBank)
router.get("/profile", authMiddleware, getProfileController)
router.get("/users", authMiddleware, getAllUsers)
module.exports=router