const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			unique: [true, 'Name already exist'],
			trim: true,
			lowercase: true,
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
		soldCount: {
			type: Number,
			default: 0,
		},
		sku: {
			type: String,
		},
		images: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Image',
			},
		],
		coverPhoto: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Image',
			},
		],
		salePrice: {
			type: Number,
		},
		fileDownloadLink: {
			type: String,
		},
		// TODO: Need to improve this category and tags
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
		// category: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: 'Category',
		// },
		collections: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Collection',
			},
		],
		categories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Category',
			},
		],
		isPublished: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('item', itemSchema);
