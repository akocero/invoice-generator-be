const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountSchema = new Schema(
	{
		code: {
			type: String,
			required: [true, 'Code is required'],
			unique: [true, 'Code already exist'],
		},
		discountKind: {
			type: String,
			required: [true, 'Type is required'],
		},
		discountValue: {
			type: Number,
			required: [true, 'Value is required'],
		},
		isDeleted: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{ timestamps: true },
);

discountSchema.pre(/^find/, function (next) {
	// console.log('THIS', this);
	this.where({
		$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
	});
	return next();
});

discountSchema.methods.softDelete = function () {
	this.isDeleted = true;

	return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('discount', discountSchema);
