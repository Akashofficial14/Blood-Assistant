const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./router/auth.routes");
const bloodBankOwnerRoutes = require("./router/bloodBankOwner.routes");
const adminRoutes = require("./router/admin.routes");
const bloodbankRoutes = require("./router/bloodBank.routes");
const chatRoutes = require("./router/chat.routes")
const userRoutes = require("./router/user.routes");
const nearbyBloodBankRoutes = require("./router/nearbybloodbanks.routes");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieParser = require("cookie-parser");
const userModel = require("./models/user.model");
const { errorMiddleware } = require("./middlewares/error.middleware");
const app = express();
connectDB();

app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let email = profile.emails[0].value;
        let name = profile.name.givenName;

        // Check if the user already exists (registered manually first)
        let existingUser = await userModel.findOne({ email });

        if (existingUser) {
          // If they registered as 'manage_bank' manually, this keeps that role
          existingUser.isVerified = true;
          if (!existingUser.google_id) existingUser.google_id = profile.id;

          await existingUser.save();
          return cb(null, existingUser);
        }

        // If NO user exists, they are a NEW Google User -> Default to 'find_blood'
        let newregUser = await userModel.create({
          name,
          email,
          password: "google_auth_user",
          userRole: "find_blood", // Hardcoded default for new social logins
          google_id: profile.id,
          isVerified: true,
        });

        return cb(null, newregUser);
      } catch (error) {
        return cb(error, null);
      }
    }
  ),
);
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
const allowedOrigins = [
  "http://localhost:5173",
  "https://blood-assistant-emd4.vercel.app",  // ← replace with your Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// app.get("/",(req,res)=>{
//     res.render("index.ejs")
// })
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/bloodbankowner", bloodBankOwnerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/search", nearbyBloodBankRoutes);
app.use("/api/bloodbank", bloodbankRoutes);
app.use("/api/chat", chatRoutes)

app.use(errorMiddleware);
module.exports = app;
