const User = require('../models/user.model.js');
const factory = require('../utils/contollersFactory.js');

const index = factory.index(User);

module.exports = { index };
