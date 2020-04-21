var mongoose = require('mongoose'); //lead to model
var billsSchema = require('../schemas/bills'); //load model
module.exports = mongoose.model('Bill', billsSchema); // assign table name