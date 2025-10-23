import mongoose from "mongoose";
import { Point } from "./models/points";
import { SyncManager } from "./models/syncManager";

async function populate() {
	const config = useRuntimeConfig();
	await mongoose.connect(config.db.mongo.uri);

	const pointOne = await Point.create(
		{
			name: "Posto de Coleta Central",
			address: "Av. Brasil, 1234 - Centro, Rio de Janeiro - RJ",
			phone: "+55 21 1234-5678",
			link: "https://example.com/posto-central",
			active: true,
			type: "hospital", // ou outro tipo definido por você
			expirationDate: new Date("2025-12-31"),
			loc: {
				type: "Point",
				coordinates: [-43.2096, -22.9035] // Exemplo: [longitude, latitude] do Rio de Janeiro
			}
		}
	);

	const hemocioneIdSyncManager = await SyncManager.create({
		providerName: "HemocioneId",
	})

	console.log("Populate done");
	await mongoose.disconnect();
}


populate().catch((err) => {
	console.log(err);
	mongoose.disconnect();
});
