const Tag = require('../models/tag.model.js');
const factory = require('../utils/contollersFactory.js');

const index = factory.index(Tag);
const store = factory.store(Tag);
const show = factory.show(Tag);
const update = factory.update(Tag);
const destroy = factory.destroy(Tag);

module.exports = { index, store, show, destroy, update };
