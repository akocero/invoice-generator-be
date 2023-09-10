const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			unique: [true, 'Name already exist'],
		},
		isDeleted: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{ timestamps: true },
);

tagSchema.pre(/^find/, function (next) {
	// console.log('THIS', this);
	this.where({
		$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
	});
	return next();
});

tagSchema.methods.softDelete = function () {
	this.isDeleted = true;

	return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Tag', tagSchema);
