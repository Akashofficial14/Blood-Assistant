const connectDB = require('../config/db');
const userModel = require('../models/user.model');
require('dotenv').config({ path: '../../.env' });

const createAdmin = async () => {
    try {
        await connectDB();
        const adminData = {
            name: 'Akash Warade',
            email: 'akashwarade666@gmail.com',
            password: '12345678',
            phone: '9174571636',
            userRole: 'admin',
            isVerified: true,
        };

        let existingAdmin = await userModel.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin already exists!');
            process.exit(0);
        }

        let admin = await userModel.create(adminData);
        console.log('Admin created successfully!');
        console.log('Email:', admin.email);
        process.exit(0);
    } catch (error) {
        console.log('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();