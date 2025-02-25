const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";
let client;

async function connectDB() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
    return client.db("APDEVcluster");
}

async function deleteUser(userId) {
    try {
        if (!userId) {
            console.error("❌ Error: User ID is missing.");
            return { success: false, message: "User ID is missing" };
        }

        if (!ObjectId.isValid(userId)) {
            console.error("❌ Error: Invalid User ID format.");
            return { success: false, message: "Invalid User ID format" };
        }

        const db = await connectDB();
        const usersCollection = db.collection("users");

        const deletedUser = await usersCollection.findOneAndDelete({ _id: ObjectId.createFromHexString(userId) });

        if (!deletedUser || !deletedUser.value) {
            console.error("❌ User not found in database:", userId);
            return { success: false, message: "User not found in database" };
        }

        console.log("✅ User deleted from database:", deletedUser.value);
        return { success: true, message: "User deleted successfully" };

    } catch (error) {
        console.error("❌ Error deleting user:", error);
        return { success: false, message: "Server error" };
    }
}

module.exports = { deleteUser };
