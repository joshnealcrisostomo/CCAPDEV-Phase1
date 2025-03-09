const mongoose = require("mongoose");
const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";
const User = require('./UserSchema.js');

mongoose.connect(uri);

async function loginUser(username, password) {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        if (user.password !== password) {
            return { success: false, message: 'Invalid password' };
        }
        return { success: true, user };
    } catch (error) {
        console.error('Error in loginUser:', error);
        return { success: false, message: error.message || 'Internal server error' };
    }
}

module.exports = { loginUser };
