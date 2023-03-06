const Category = require('../models/category.model.js');
const factory = require('../utils/contollersFactory.js');

const index = factory.index(Category,
	{
		path: 'coverPhoto',
	});
const store = factory.store(Category);
const show = factory.show(Category, {
	path: 'coverPhoto',
});
const update = factory.update(Category, {
	path: 'coverPhoto',
});
const destroy = factory.destroy(Category);

module.exports = { index, store, show, destroy, update };
