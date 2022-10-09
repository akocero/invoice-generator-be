import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const itemSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			unique: [true, 'Name already exist'],
		},
		description: {
			type: String,
		},
		purchaseNote: {
			type: String,
		},
		unitCost: {
			type: Number,
			required: [true, 'Unit Cost is required'],
		},
		quantity: {
			type: Number,
			default: 0,
		},
		sku: {
			type: String,
		},
		images: [
			{
				public_id: String,
				secure_url: String,
				width: Number,
				height: Number,
			},
		],
		coverPhoto: {
			public_id: String,
			secure_url: String,
			width: Number,
			height: Number,
		},
		salePrice: {
			type: Number,
		},
		fileDownloadLink: {
			type: String,
		},
		tags: [
			{
				type: String,
			},
		],
		categories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Category',
			},
		],
	},
	{ timestamps: true },
);

export default mongoose.model('item', itemSchema);
