const EcommSetting = require('../models/ecomm_setting.model.js');
const cloudinary = require('../utils/cloudinary.js');
const factory = require('../utils/contollersFactory.js');
const AppError = require('../utils/appError.js');

const index = factory.index(
	EcommSetting,
	{
		path: 'heros',
	},
	{
		path: 'navbarBGs',
	},
	{
		path: 'logoSm',
	},
	{
		path: 'logoFlat',
	},
	{
		path: 'logoBase',
	},
);
const store = factory.store(EcommSetting);
const show = factory.show(
	EcommSetting,
	{
		path: 'heros',
	},
	{
		path: 'navbarBGs',
	},
	{
		path: 'logoSm',
	},
	{
		path: 'logoFlat',
	},
	{
		path: 'logoBase',
	},
);
const update = factory.update(
	EcommSetting,
	{
		path: 'heros',
	},
	{
		path: 'navbarBGs',
	},
	{
		path: 'logoSm',
	},
	{
		path: 'logoFlat',
	},
	{
		path: 'logoBase',
	},
);
const destroy = factory.destroy(EcommSetting);

module.exports = { index, store, show, destroy, update };
