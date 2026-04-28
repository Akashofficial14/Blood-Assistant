const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userModel = require('../models/user.model')

dotenv.config()

const createAdmin = async () => {
    try {
            await mongoose.connect("mongodb://localhost:27017/blood-assistant");
    console.log('MongoDB connected...');
 
        const adminData = {
            name: 'Akash Warade',
            email: 'akashwarade666@gmail.com',
            password: '12345678',
            phone: '9174571636',
            userRole: 'admin',
            isVerified: true,
        }

        let existingAdmin = await userModel.findOne({ email: adminData.email })
        if (existingAdmin) {
            console.log('Admin already exists!')
            process.exit(0)
        }

        let admin = await userModel.create(adminData)
        console.log('Admin created successfully!')
        console.log('Email:', admin.email)

    } catch (error) {
        console.log('Error:', error.message)
    }
}

createAdmin()