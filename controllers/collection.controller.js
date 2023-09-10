const Collection = require('../models/collection.model.js');
const factory = require('../utils/contollersFactory.js');

const index = factory.index(
	Collection,
	{
		path: 'coverPhoto',
	},
	{
		path: 'shopBanner',
	},
);
const store = factory.store(Collection);
const show = factory.show(
	Collection,
	{
		path: 'coverPhoto',
	},
	{
		path: 'shopBanner',
	},
);
const update = factory.update(
	Collection,
	{
		path: 'coverPhoto',
	},
	{
		path: 'shopBanner',
	},
);
const destroy = factory.destroy(Collection);

module.exports = { index, store, show, destroy, update };
