const Hero = require('../models/hero.model.js');
const factory = require('../utils/contollersFactory.js');

const index = factory.index(Hero, {
	path: 'coverPhoto',
});
const store = factory.store(Hero);
const show = factory.show(Hero, {
	path: 'coverPhoto',
});
const update = factory.update(Hero, {
	path: 'coverPhoto',
});
const destroy = factory.destroy(Hero);

module.exports = { index, store, show, destroy, update };
