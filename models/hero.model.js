const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heroSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			unique: [true, 'Title already exist'],
		},
		isPublished: {
			type: Number,
			default: 0,
		},
		link: {
			type: String,
			default: '/',
		},
		buttonText: {
			type: String,
			default: 'DEFAULT_TEXT',
		},
		description: {
			type: String,
		},
		coverPhoto: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Image',
			},
		],
		isDeleted: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{ timestamps: true },
);
heroSchema.pre(/^find/, function (next) {
	// console.log('THIS', this);
	this.where({
		$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
	});
	return next();
});

heroSchema.methods.softDelete = function () {
	this.isDeleted = true;

	return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Hero', heroSchema);
