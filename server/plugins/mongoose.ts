import mongoose from "mongoose";

export default defineNitroPlugin(async (_nitro) => {
	if (mongoose.connection.readyState !== 1) {
		const config = useRuntimeConfig();
		try {
			await mongoose.connect(config.db.mongo.uri);
		} catch (error: any) {
			console.error("Failed to connect to MongoDB:", error);
			throw error;
		}
	}
});
