var mongoose = require('mongoose'); //lead to model
var menusSchema = require('../schemas/menus'); //load model
module.exports = mongoose.model('Menu', menusSchema); // assign table name