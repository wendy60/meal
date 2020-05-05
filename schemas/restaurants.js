var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

    category: {
        type: mongoose.Schema.Types.String,
        ref: "Category"
    },
    title: String,

    manager: {
        type: String,
        ref: ""
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu"
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