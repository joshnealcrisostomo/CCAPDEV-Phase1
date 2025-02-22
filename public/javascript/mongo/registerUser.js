const mongoose = require("mongoose");
const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";
const User = require('./UserSchema.js'); // Replace with the actual path to your user.model.js file

mongoose.connect(uri);

async function registerUser(email, displayName, username, password, bio, profilePic) {
    console.log('registerUser function called', email, displayName, username, password, bio, profilePic);
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return { success: false, message: 'User already exists' };
        }
        const newUser = new User({
            email,
            displayName,
            username,
            password, // Ensure the password is hashed before saving
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