// updateUser.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";

async function updateUser(username, displayName, bio) {
    console.log("updateUser called with:", username, displayName, bio);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test');
        const usersCollection = db.collection('users');

        const result = await usersCollection.updateOne(
            { username: username },
            { $set: { displayName: displayName, bio: bio } }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: 'User not found' };
        }

        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, message: 'Error updating user' };
    } finally {
        await client.close();
    }
}

module.exports = { updateUser };