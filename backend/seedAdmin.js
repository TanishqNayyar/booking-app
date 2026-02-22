const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@experthub.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin already exists!');
      console.log('Email: admin@experthub.com');
      console.log('Password: admin123');
      process.exit();
    }

    // Create admin with bcrypt hash
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@experthub.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'admin'
    });

    console.log('✅ Admin created successfully!');
    console.log('Email: admin@experthub.com');
    console.log('Password: admin123');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();