const EcommSetting = require('../models/ecomm_setting.model.js');
const cloudinary = require('../utils/cloudinary.js');
const factory = require('../utils/contollersFactory.js');
const AppError = require('../utils/appError.js');

const index = factory.index(EcommSetting);
const store = factory.store(EcommSetting);
const show = factory.show(EcommSetting);
const update = factory.update(EcommSetting);
const destroy = factory.destroy(EcommSetting);
const destroyImage = factory.destroyImage(EcommSetting);

module.exports = { index, store, show, destroy, update, destroyImage };
