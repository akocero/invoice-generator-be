import Tag from '../models/tag.model.js';
import factory from '../utils/contollersFactory.js';

const index = factory.index(Tag);
const store = factory.store(Tag);
const show = factory.show(Tag);
const update = factory.update(Tag);
const destroy = factory.destroy(Tag);
// const destroyImage = factory.destroyImage(Item);

export { index, store, show, destroy, update };
