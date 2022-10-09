import Item from '../models/item.model.js';
import cloudinary from '../utils/cloudinary.js';
import factory from '../utils/contollersFactory.js';
import AppError from '../utils/appError.js';

const index = factory.index(Item);
const store = factory.store(Item);
const show = factory.show(Item);
const update = factory.update(Item);
const destroy = factory.destroy(Item);
const destroyImage = factory.destroyImage(Item);

export { index, store, show, destroy, update, destroyImage };
