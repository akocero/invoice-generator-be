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
		productType: {
			type: String,
			default: 'physical',
			enum: ['physical', 'digital'],
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
		salePrice: {
			type: Number,
		},
		actualCost: {
			type: Number,
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

		fileDownloadLink: {
			type: String,
			required: [
				function () {
					// Make fileDownloadLink required only for digital products
					return this.productType === 'digital';
				},
				'Download Link is required for digital products',
			],
		},
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
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
		isDeleted: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{ timestamps: true },
);

itemSchema.pre(/^find/, function (next) {
	// console.log('THIS', this);
	this.where({
		$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
	});
	return next();
});

itemSchema.methods.softDelete = function () {
	this.isDeleted = true;

	return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('item', itemSchema);
