var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

    username: String,
    password: String,
    age: Number,
    gender: String,
    email: String,
    phone_number: Number,
    address: String,


    isAdmin: {
        type: Boolean,
        default: false
    },
    isManager: {
        type: Boolean,
        default: false
    }

});