const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ecommSettingSchema = new Schema(
	{
		banners: [
			{
				text: {
					type: String,
					required: [true, 'Text is required'],
				},
				name: {
					type: String,
					required: [true, 'Name is required'],
					unique: [true, 'Name already exist'],
				},
				isActive: {
					type: Boolean,
					default: false,
				},
			},
		],
		heros: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Image',
			},
		],
		navbarBGs: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Image',
			},
		],
		activeHero: {
			type: String,
		},
		activeNavbarBG: {
			type: String,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('EcommSetting', ecommSettingSchema);
