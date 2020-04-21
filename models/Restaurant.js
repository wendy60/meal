var mongoose = require('mongoose');
var restaurantsSchema = require('../schemas/restaurants');

module.exports = mongoose.model('Restaurant', restaurantsSchema);