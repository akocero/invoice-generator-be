const Collection = require('../models/collection.model.js');
const factory = require('../utils/contollersFactory.js');

const index = factory.index(Collection);
const store = factory.store(Collection);
const show = factory.show(Collection);
const update = factory.update(Collection);
const destroy = factory.destroy(Collection);
// const destroyImage = factory.destroyImage(Item);

module.exports = { index, store, show, destroy, update };
