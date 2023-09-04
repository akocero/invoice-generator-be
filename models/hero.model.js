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
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Hero', heroSchema);
