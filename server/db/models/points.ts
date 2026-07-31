import { Schema, InferSchemaType, model } from "mongoose";

const PointsSchema = new Schema({
	name: {
		type: String,
		required: true,
	},

	displayName: {
		type: String,
		required: false,
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

}, { timestamps: true })


export type PointsSchema = InferSchemaType<typeof PointsSchema>;

// Add a 2dsphere index to the loc field for geospatial queries
PointsSchema.index({ loc: '2dsphere' })

export const Point = model<PointsSchema>("Point", PointsSchema);
