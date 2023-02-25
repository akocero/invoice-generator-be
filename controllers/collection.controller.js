const Collection = require('../models/collection.model.js');
const factory = require('../utils/contollersFactory.js');

const index = factory.index(Collection);
const store = factory.store(Collection);
const show = factory.show(Collection, {
	path: 'coverPhoto',
});
const update = factory.update(Collection, {
	path: 'coverPhoto',
});
const destroy = factory.destroy(Collection);

module.exports = { index, store, show, destroy, update };
