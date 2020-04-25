var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

    title: String,
    meal: String,
    price: Number,
    addtime: {
        type: Date,
        default: new Date()
    },

});