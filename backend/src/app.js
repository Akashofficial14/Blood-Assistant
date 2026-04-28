const express=require("express")
const connectDB=require("./config/db")
const authRoutes=require("./router/auth.routes")
const bloodBankOwnerRoutes=require("./router/bloodbankowner.routes")
const adminRoutes=require("./router/admin.routes")
const cors=require("cors")
require("dotenv").config()
const passport=require ("passport")
const GoogleStrategy=require("passport-google-oauth20").Strategy
const cookieParser=require("cookie-parser")
const userModel = require("./models/user.model")
const app=express()
connectDB()

app.use(passport.initialize())
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/google/callback"
},
  async function(accessToken, refreshToken, profile, cb) {
   try {
     console.log("Google Auth - Profile received:", profile.emails[0].value)
    let email = profile.emails[0].value
    let name = profile.name.givenName
    
    let existingUser = await userModel.findOne({ email })
    if (existingUser) {
      console.log("Existing user found, updating google_id if needed")
      // Add google_id if it doesn't exist
      if (!existingUser.google_id) {
        existingUser.google_id = profile.id;
        await existingUser.save();
      }
      return cb(null, existingUser)
    }
    
    //agar aisa nhi hai matlan naya user hai to uska data mongoDB me save karwao or fir usko return karwa do
    console.log("Creating new user via Google Auth")
    let newregUser = await userModel.create({
      name, 
      email,
      password: "google_auth_user",
      userRole: "find_blood",
      google_id: profile.id
    })
    console.log("New user created:", newregUser.email)
    return cb(null, newregUser)
   } catch (error) {
    console.error("Google Auth Error:", error.message)
    return cb(error, null)
   }
  }
));
app.use(express.json())
app.use(cookieParser())
app.set("view engine", "ejs")
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
// app.get("/",(req,res)=>{
//     res.render("index.ejs")
// })
app.use(express.urlencoded({extended:true}))
app.use("/api/auth",authRoutes)
app.use("/api/bloodbankowner",bloodBankOwnerRoutes)
app.use("/api/admin",adminRoutes)
module.exports=app