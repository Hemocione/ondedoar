import type { InferSchemaType } from "mongoose";
import { Schema, Types, model } from "mongoose";

const PointsSchema = new Schema({


	name: {
		type: String,
		required: true,
	},

	address: {
		type: String,
		required: true,
	},

	phone: {
		type: String,
		required: true,
	},

	link: {
		type: String,
		required: true,
	},

	active: {
		type: Boolean,
		required: true,
		default: true,
	},

	type: {
		type: String,
		required: true,
	},

	expirationDate: {
		type: Date,
		required: true,
	},

	loc: {
		type: {
			type: String,
			enum: ['Point'], // Obrigatório para GeoJSON
			required: true
		},
		coordinates: {
			type: [Number], // [longitude, latitude]
			required: true
		}
	}

})


export type PointsSchema = InferSchemaType<typeof PointsSchema>;

export const Points = model<PointsSchema>("Point", PointsSchema);
