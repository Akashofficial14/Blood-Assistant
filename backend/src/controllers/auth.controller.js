const userModel = require("../models/user.model")
// const sendMail = require("../services/mail.service")
const jwt = require("jsonwebtoken")
const customError = require("../utills/customError")
const responseUtil = require("../utills/response.utill")
const registerController = async (req, res, next) => {
    try {
        let { name, email, password, userRole } = req.body
        if (!name || !email || !password || !userRole) throw new customError("All fields are required", 400)
        let existedUser = await userModel.findOne({ email })
        if (existedUser) throw new customError("user already exists", 409)
        let newUser = await userModel.create({
            name, email, password, userRole
        })
        if (!newUser) throw new customError("Something went wrong", 400)
        let token = newUser.generateToken()
        //verify email
        //     const mailUrl = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`
        //     await sendMail(email, "Verify Your Blood Assistant Account",
        //         `
        // <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        //     <div style="background-color: #ef4444; padding: 20px; text-align: center;">
        //         <h1 style="color: white; margin: 0; font-size: 24px;">Blood Assistant</h1>
        //     </div>
        //     <div style="padding: 30px; text-align: center; line-height: 1.6;">
        //         <h2 style="color: #333;">Verify Your Email</h2>
        //         <p style="color: #555; font-size: 16px;">
        //             Thank you for joining Blood Assistant. Please click the button below to verify your email address and log in to your account.
        //         </p>
        //         <div style="margin: 30px 0;">
        //             <a href="${mailUrl}" style="background-color: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
        //                 Verify Email Address
        //             </a>
        //         </div>
        //         <p style="color: #888; font-size: 12px;">
        //             If the button doesn't work, copy and paste this link into your browser: <br>
        //             <a href="${mailUrl}" style="color: #ef4444;">${mailUrl}</a>
        //         </p>
        //     </div>
        //     <div style="background-color: #f9f9f9; padding: 15px; text-align: center; color: #999; font-size: 12px;">
        //         &copy; ${new Date().getFullYear()} Blood Assistant. All rights reserved.
        //     </div>
        // </div>
        // `
        //     );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,      // Deployment par true hona chahiye (HTTPS)
            sameSite: "none",  // Cross-site requests ke liye zaroori hai
            maxAge: 24 * 60 * 60 * 1000
        })
        return responseUtil.created(
            res,
            { token, newUser },
            "User Registered Successfully",
        )
    } catch (error) {
        return next(error)
    }

}

const verifyEmailController = async (req, res, next) => {
    try {
        let token = req.params.token
        if (!token) throw new customError("token not found", 401)
        let decode = jwt.verify(token, process.env.JWT_TOKEN)
        if (!decode) throw new customError("invalid token", 401)
        //aapko isverified ko true krna hai ab to decode se aap user nikal lo id ka use karke or isverified ko true krdo then open login step
        let updatedUser = await userModel.findByIdAndUpdate(
            decode.id,
            { isVerified: true },
            { new: true } // Isse updated user return hoga
        );
        // console.log("new user is -->", updatedUser)
        //isse mongo me change ho jayegaa or isverified true ho jayega
        return res.render("verifyEmail")
    } catch (error) {
        return next(error)
    }
}

const loginController = async (req, res, next) => {
    try {
        let { email, password } = req.body
        if (!email || !password) throw new customError("All fields are required", 400)
        //yaha par user exist karta hoga to aa jayega
        let existedUser = await userModel.findOne({ email })
        if (!existedUser) throw new customError("user does not exists", 404)

        // if (!existedUser.isVerified) throw new customError("verify first from your email", 401)
        // bcrypt.compare ek asynchronous function hai jo Promise return karta hai. Agar aap await nahi lagayenge, toh checkPass hamesha
        //  ek "Pending Promise" rahega. JavaScript mein ek Promise object hamesha truthy mana jata hai, isliye aapki if (!checkPass) wali 
        // condition kabhi trigger hi nahi hoti.
        let checkPass = await existedUser.comparePassword(password)
        if (!checkPass) throw new customError("invalid email or password", 401)
        let token = existedUser.generateToken()
        res.cookie("token", token, {
            httpOnly: false,
            secure: true,      // Deployment par true hona chahiye (HTTPS)
            sameSite: "none",  // Cross-site requests ke liye zaroori hai
            maxAge: 24 * 60 * 60 * 1000
        })
        return responseUtil.success(
            res,
            { token, user: existedUser },
            "user loggedIn successfully",
        )
    } catch (error) {
        return next(error)
    }
}

const logoutController = async (req, res, next) => {
    try {
        //yaha par user logggedin hona chahiye tabhi wo logout hoga iske liye middleware laga diya hai jisse login user ka data mil jayega req.id 
        // me or agar userID nhi aayegi to return kr dege aagyi to cookie clear kar dege
        let userID = req.user.id
        if (!userID) throw new customError("user id not found", 401)
        res.clearCookie("token")
        return responseUtil.success(res, {}, "user logged out")
    } catch (error) {
        return next(error)
    }
}

const forgetPasswordController = async (req, res, next) => {
    try {
        // Frontend se 'email' field hi aana chahiye
        let { email } = req.body;

        // Validation
        if (!email) {
            throw new customError("Email is required", 400);
        }

        // Check user in DB
        let existedUser = await userModel.findOne({ email });
        if (!existedUser) {
            throw new customError("User doesn't exist with this email", 404);
        }

        // Generate temporary token (valid for 10 mins)
        // Note: Make sure process.env.JWT_RAW_SECRET is defined in your .env
        let token = jwt.sign(
            { id: existedUser._id },
            process.env.JWT_RAW_SECRET,
            { expiresIn: '10min' }
        );

        // Reset Link - Frontend route link
        let link = `${process.env.FRONTEND_URL}/login/reset-pass/${token}`;

        // Send the email
        await sendMail(
            email,
            "Reset Your Password - Blood Assistant",
            `<div>
                <h3>Blood Assistant Password Reset</h3>
                <p>Click on the link below to reset your password. This link expires in 10 minutes.</p>
                <a href="${link}" style="background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p style="margin-top: 20px;">If the button doesn't work, copy-paste this link:</p>
                <p>${link}</p>
            </div>`
        );

        return responseUtil.success(res, {}, "Reset link sent successfully to your email");

    } catch (error) {
        return next(error);
    }
};

const resetPasswordController = async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            throw new customError("Token not found", 400);
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_RAW_SECRET);

        // IMPORTANT: Send JSON, not res.render
        return responseUtil.success(
            res,
            { userID: decoded.id },
            "Token is valid",
        );

    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return next(new customError("Link expired or invalid", 401));
        }
        return next(error);
    }
};

const updatePasswordController = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const { password } = req.body;

        if (!userID) {
            throw new customError("User context missing", 400);
        }

        if (!password) {
            throw new customError("New password is required", 400);
        }

        const user = await userModel.findById(userID);
        if (!user) {
            throw new customError("User not found", 404);
        }

        // Directly assigning will trigger your 'pre-save' hook 
        // (assuming you have one for bcrypt hashing)
        user.password = password;
        await user.save();

        return responseUtil.success(
            res,
            {},
            "Password updated successfully. You can now login.",
        );

    } catch (error) {
        return next(error);
    }
};

const updateProfileController = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const { name, email } = req.body;
        console.log('userID from params:', userID, name, email);

        if (!userID) throw new customError("User ID is required", 400);
        const loggedInUserId = req.user.id || req.user._id; // Depending on your token payload

        if (loggedInUserId !== userID) {
            throw new customError("Unauthorized: You cannot update someone else's profile", 401);
        }

        // Update the user and return the new document
        const updatedUser = await userModel.findByIdAndUpdate(
            userID,
            { name, email },
            { new: true, runValidators: true }
        );

        if (!updatedUser) throw new customError("User not found", 404);

        return responseUtil.success(
            res,
            updatedUser,
            "Profile updated successfully"
        );
    } catch (error) {
        return next(error);
    }
};

module.exports = { registerController, loginController, logoutController, verifyEmailController, forgetPasswordController, resetPasswordController, updatePasswordController, updateProfileController }