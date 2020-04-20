var mongoose = require('mongoose'); //lead to model
var categoriesSchema = require('../schemas/categories'); //load model
module.exports = mongoose.model('Category', categoriesSchema); // assign table name