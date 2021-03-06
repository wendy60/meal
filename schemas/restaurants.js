var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

    category: {
        type: mongoose.Schema.Types.String,
        ref: "Category"
    },
    title: String,

    customer: {
        type: mongoose.Schema.Types.String,
        ref: "Customer"
    },
    addtime: {
        type: Date,
        default: new Date()
    },
    views: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    comments: {
        type: Array,
        default: []

    }

});