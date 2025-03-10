const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";

async function updateUser(username, displayName, bio, profilePic, headerPic) {
    console.log("updateUser called with:", username, displayName, bio, profilePic, headerPic);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test');
        const usersCollection = db.collection('users');

        const updateFields = { displayName, bio };
        if (profilePic) updateFields.profilePic = profilePic;
        if (headerPic) updateFields.headerPic = headerPic;

        const result = await usersCollection.updateOne(
            { username: username },
            { $set: updateFields }
        );
w
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
