const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";
const client = new MongoClient(uri);

async function deleteUser(userId) {
    try {
        await client.connect();
        const db = client.db("APDEVcluster");
        const usersCollection = db.collection("users");

        const deletedUser = await usersCollection.findOneAndDelete({ _id: new ObjectId(String(userId)) });

        if (!deletedUser || !deletedUser.value) {
            console.error("❌ User not found in database:", userId);
            return { success: false, message: "User not found in database" };
        }

        console.log("✅ User deleted from database:", deletedUser.value);
        return { success: true, message: "User deleted successfully" };

    } catch (error) {
        console.error("❌ Error deleting user:", error);
        return { success: false, message: "Server error" };
    } finally {
        console.log("🔄 Closing MongoDB connection.");
        await client.close();
    }
}

module.exports = { deleteUser };
