const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ecommSettingSchema = new Schema(
	{
		is_maintenance: {
			type: Boolean,
			default: false,
		},
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
		about: {
			type: String,
			default: 'DEFAULT_TEXT',
		},
		orderTracking: {
			type: String,
			default: 'DEFAULT_TEXT',
		},
		returnPolicy: {
			type: String,
			default: 'DEFAULT_TEXT',
		},
		faq: {
			type: String,
			default: 'DEFAULT_TEXT',
		},
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

		logoSm: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Image',
			},
		],
		logoFlat: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Image',
			},
		],
		logoBase: [
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
