import Collection from '../models/collection.model.js';
import factory from '../utils/contollersFactory.js';

const index = factory.index(Collection);
const store = factory.store(Collection);
const show = factory.show(Collection);
const update = factory.update(Collection);
const destroy = factory.destroy(Collection);
// const destroyImage = factory.destroyImage(Item);

export { index, store, show, destroy, update };
