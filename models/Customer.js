var mongoose = require('mongoose');
var customersSchema = require('../schemas/customers');
module.exports = mongoose.model('Customer', customersSchema);