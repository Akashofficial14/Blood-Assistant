const userModel = require("../models/user.model")
const sendMail = require("../services/mail.service")
const jwt = require("jsonwebtoken")
const registerController = async (req, res) => {
    try {
        let { name, email, password, userRole } = req.body
        if (!name || !email || !password || !userRole) return res.status(400).json({
            message: "All fields are required"
        })
        let existedUser = await userModel.findOne({ email })
        if (existedUser) return res.status(401).json({
            message: "user already exists"
        })
        let newUser = await userModel.create({
            name, email, password, userRole
        })
        if (!newUser) return res.status(400).json({
            message: "Something went wrong"
        })
        let token = newUser.generateToken()
        //verify email
        const mailUrl = `http://localhost:3000/api/auth/verify-email/${token}`
        await sendMail(email, "Verification Email ",
            `<h3>click on the below link to login to your account</h3>
             ${mailUrl}
            `
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,      // Deployment par true hona chahiye (HTTPS)
            sameSite: "none",  // Cross-site requests ke liye zaroori hai
            maxAge: 24 * 60 * 60 * 1000
        })
        return res.status(201).json({
            success: true,
            message: "email verification link sent to your account",
            token: token,
            newUser,
        })
    } catch (error) {
        console.log("error is-->", error)
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error
        })
    }

}

const verifyEmailController = async (req, res) => {
    try {
        let token = req.params.token
        if (!token) return res.status(401).json({
            message: "token not found"
        })
        let decode = jwt.verify(token, process.env.JWT_TOKEN)
        if (!decode) return res.status(401).json({
            message: "invalid token"
        })
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
        console.log("error", error)
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error
        })
    }
}

const loginController = async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) return res.status(400).json({
            message: "All fields are required"
        })
        //yaha par user exist karta hoga to aa jayega
        let existedUser = await userModel.findOne({ email })
        if (!existedUser) return res.status(401).json({
            message: "user does not exists"
        })

        if (!existedUser.isVerified) return res.status(401).json({
            message: "verify first from your email"
        })
        // bcrypt.compare ek asynchronous function hai jo Promise return karta hai. Agar aap await nahi lagayenge, toh checkPass hamesha
        //  ek "Pending Promise" rahega. JavaScript mein ek Promise object hamesha truthy mana jata hai, isliye aapki if (!checkPass) wali 
        // condition kabhi trigger hi nahi hoti.
        let checkPass = await existedUser.comparePassword(password)
        if (!checkPass) return res.status(404).json({
            message: "invalid email or password"
        })
        let token = existedUser.generateToken()
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,      // Deployment par true hona chahiye (HTTPS)
            sameSite: "none",  // Cross-site requests ke liye zaroori hai
            maxAge: 24 * 60 * 60 * 1000
        })
        return res.status(201).json({
            success: true,
            message: "user loggedIn successfully",
            token: token,
            user: existedUser
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error
        })
    }
}

const logoutController = async (req, res) => {
    try {
        //yaha par user logggedin hona chahiye tabhi wo logout hoga iske liye middleware laga diya hai jisse login user ka data mil jayega req.id 
        // me or agar userID nhi aayegi to return kr dege aagyi to cookie clear kar dege
        let userID = req.user.id
        if (!userID) return res.status(401).json({
            message: "user id not found"
        })
        res.clearCookie("token")
        return res.status(200).json({
            message: "user logged out",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error
        })
    }
}

const forgetPasswordController = async (req, res) => {
    try {
        // Frontend se 'email' field hi aana chahiye
        let { email } = req.body;

        // Validation
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            });
        }

        // Check user in DB
        let existedUser = await userModel.findOne({ email });
        if (!existedUser) {
            return res.status(404).json({
                message: "User doesn't exist with this email",
                success: false
            });
        }

        // Generate temporary token (valid for 10 mins)
        // Note: Make sure process.env.JWT_RAW_SECRET is defined in your .env
        let token = jwt.sign(
            { id: existedUser._id },
            process.env.JWT_RAW_SECRET,
            { expiresIn: '10min' }
        );

        // Reset Link - Frontend route link
        let link = `http://localhost:5173/login/reset-pass/${token}`;

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

        return res.status(200).json({
            message: "Reset link sent successfully to your email",
            success: true
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ success: false, message: "Token not found" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_RAW_SECRET);
        
        // IMPORTANT: Send JSON, not res.render
        return res.status(200).json({
            success: true,
            message: "Token is valid",
            userID: decoded.id // React will use this for the next step
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Link expired or invalid",
            error: error.message
        });
    }
};

const updatePasswordController = async (req, res) => {
    try {
        const { userID } = req.params;
        const { password } = req.body;

        if (!userID) {
            return res.status(400).json({
                success: false,
                message: "User context missing"
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "New password is required"
            });
        }

        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Directly assigning will trigger your 'pre-save' hook 
        // (assuming you have one for bcrypt hashing)
        user.password = password;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully. You can now login.",
        });

    } catch (error) {
        console.error("Update Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update password",
            error: error.message
        });
    }
};
module.exports = { registerController, loginController, logoutController, verifyEmailController, forgetPasswordController, resetPasswordController, updatePasswordController }