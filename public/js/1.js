var cookies = require('cookies');
var express = require('express');
var app = express(); //create app 
app.use(function(req, res, next) {
    req.cookies = new cookies(req, res);
    //parser cookie information for login user
    req.customerInfo = {};
    if (req.cookies.get('customerInfo')) {
        try {
            req.customerInfo = JSON.parse(req.cookies.get('customerInfo'));

            Customer.findById(req.customerInfo._id).then(function(customerInfo) {
                req.customerInfo.isAdmin = Boolean(customerInfo.isAdmin);
                next();
            })

        } catch (e) {
            next();
        }
    } else {
        next();
    }
    console.log(req.userInfo);
    return req.customerInfo;
});