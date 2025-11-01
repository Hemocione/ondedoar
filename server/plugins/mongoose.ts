import mongoose from "mongoose";

const isBuilding = () => process.env.IS_BUILDING === 'TRUE'

export default defineNitroPlugin(async (_nitro) => {
	if (mongoose.connection.readyState !== 1 && !isBuilding()) {
		const config = useRuntimeConfig();
		try {
			await mongoose.connect(config.db.mongo.uri);
		} catch (error: any) {
			console.error("Failed to connect to MongoDB:", error);
			throw error;
		}
	}
});
