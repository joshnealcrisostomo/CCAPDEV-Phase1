require('dotenv').config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uri = process.env.MONGODB_URI;
const User = require('./UserSchema.js');

mongoose.connect(uri);

async function registerUser(email, displayName, username, password, bio, profilePic) {
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return { success: false, message: 'User already exists' };
        }
        
        // Hash the password with a salt of 10 rounds
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            email,
            displayName,
            username,
            password: hashedPassword, // Store the hashed password instead of plaintext
            bio: bio || 'No bio yet.',
            profilePic: profilePic || 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png'
        });
        console.log("New User Object: ", newUser);
        await newUser.save();
        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        console.error('Error in registerUser:', error);
        return { success: false, message: error.message || 'Internal server error' };
    }
}

module.exports = { registerUser };