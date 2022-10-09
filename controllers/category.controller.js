import Category from '../models/category.model.js';
import factory from '../utils/contollersFactory.js';

const index = factory.index(Category);
const store = factory.store(Category);
const show = factory.show(Category);
const update = factory.update(Category);
const destroy = factory.destroy(Category);
// const destroyImage = factory.destroyImage(Item);

export { index, store, show, destroy, update };
