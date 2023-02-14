const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			unique: [true, 'Name already exist'],
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Tag', tagSchema);
