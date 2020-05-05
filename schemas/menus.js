var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    category: String,
    restaurant: String,
    title: String,
    meal: String,
    price: Number,
    addtime: {
        type: Date,
        default: new Date()
    },

});