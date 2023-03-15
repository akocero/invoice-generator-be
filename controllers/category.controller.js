const Category = require('../models/category.model.js');
const factory = require('../utils/contollersFactory.js');

const index = factory.index(
	Category,
	{
		path: 'coverPhoto',
	},
	{
		path: 'shopBanner',
	},
);
const store = factory.store(Category);
const show = factory.show(
	Category,
	{
		path: 'coverPhoto',
	},
	{
		path: 'shopBanner',
	},
);
const update = factory.update(
	Category,
	{
		path: 'coverPhoto',
	},
	{
		path: 'shopBanner',
	},
);
const destroy = factory.destroy(Category);

module.exports = { index, store, show, destroy, update };
