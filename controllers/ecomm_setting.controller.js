import EcommSetting from '../models/ecomm_setting.model.js';
import cloudinary from '../utils/cloudinary.js';
import factory from '../utils/contollersFactory.js';
import AppError from '../utils/appError.js';

const index = factory.index(EcommSetting);
const store = factory.store(EcommSetting);
const show = factory.show(EcommSetting);
const update = factory.update(EcommSetting);
const destroy = factory.destroy(EcommSetting);
const destroyImage = factory.destroyImage(EcommSetting);

export { index, store, show, destroy, update, destroyImage };
