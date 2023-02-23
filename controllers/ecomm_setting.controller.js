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
);
const update = factory.update(
	EcommSetting,
	false,
	{
		path: 'heros',
	},
	{
		path: 'navbarBGs',
	},
);
const destroy = factory.destroy(EcommSetting);
const destroyImage = factory.destroyImage(EcommSetting);

module.exports = { index, store, show, destroy, update, destroyImage };
