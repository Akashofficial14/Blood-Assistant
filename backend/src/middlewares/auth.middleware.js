const jwt=require("jsonwebtoken")
const userModel = require("../models/user.model")
const authMiddleware=async(req,res,next)=>{
    try {
        let token=req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1])
        if(!token) return res.status(401).json({
            message:"token not found"
        })
        
        let decode=jwt.verify(token,process.env.JWT_TOKEN)
        if(!decode) return res.status(401).json({
            message:"Invalid token"
        })
        
        let userData=await userModel.findById(decode.id)
        if(!userData) return res.status(401).json({
            message:"User not found"
        })
        
        req.user=userData
        next()
    } catch (error) {
        // Handle JWT verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message:"Token expired",
                success:false
            })
        }
        // Other errors
        return res.status(500).json({
            message:"internal server error",
            success:false,
            error: error.message
        })
    }
}
module.exports=authMiddleware