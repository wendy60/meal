var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

    restaurant: String,
    meal: String,
    dining_style: String,
    payment_method: String,
    total_price: Number,
    addtime: {
        type: Date,
        default: new Date()
    },

});