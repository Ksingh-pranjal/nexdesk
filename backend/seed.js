require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seed = async () => {
    await connectDB();

    await User.deleteMany({});

    await User.create({
        name: 'Admin User',
        email: 'admin@nexdesk.com',
        password: 'admin123',
        role: 'admin'
    });

    console.log('Admin user created!');
    console.log('Email: admin@nexdesk.com');
    console.log('Password: admin123');

    process.exit();
};

seed();