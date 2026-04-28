const express=require('express')
const {verifyBank} = require('../controllers/admin.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router=express.Router()
router.patch("/verify-bank/:bankId", authMiddleware, verifyBank)
module.exports=router