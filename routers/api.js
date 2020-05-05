var express = require('express');
var router = express.Router();
var Customer = require('../models/Customer'); //constructured function
var Restaurant = require('../models/Restaurant');

var crypto = require("crypto");

var responseData;

router.use(function(req, res, next) {

    responseData = {
        code: 0,
        message: ''
    }
    next();
});


router.post('/customer/register', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var md5 = crypto.createHash("md5");
    var enpassword = md5.update(password).digest("hex");
    var repassword = req.body.repassword;


    if (username == '') {
        responseData.code = 1;
        responseData.message = 'username cannot be empty';
        res.json(responseData);
        return;
    }

    if (password == '') {
        responseData.code = 2;
        responseData.message = 'password cannot be empty';
        res.json(responseData);
        return;
    }

    if (password != repassword) {
        responseData.code = 3;
        responseData.message = 'two passwords did not match';
        res.json(responseData);
        return;
    }

    Customer.findOne({
        username: username
    }).then(function(customerInfo) {
        if (customerInfo) {
            responseData.code = 4;
            responseData.message = 'username has been registered';
            res.json(responseData);
            return;
        }
        //save user register information to database
        var customer = new Customer({
            username: username,
            password: enpassword
        });
        return customer.save();
    }).then(function(newCustomerInfo) {
        console.log(newCustomerInfo);
        responseData.message = 'registered successfully';
        res.json(responseData);
    });
    //console.log(req.body);
});

router.post('/customer/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var md5 = crypto.createHash("md5");
    var enpassword = md5.update(password).digest("hex");


    /*if (password == '' || username != '') {
        responseData.code = 3;
        responseData.message = 'password cannot be empty';
        res.json(responseData);
        return;
    }

    else if (username == '' || password != '') {
        responseData.code = 4;
        responseData.message = 'username cannot be empty';
        res.json(responseData);
        return;
    }*/

    if (username == '' || password == '') {
        responseData.code = 1;
        responseData.message = 'both username and password cannot be empty';
        res.json(responseData);
        return;
    }




    Customer.findOne({
        username: username,
        password: enpassword
    }).then(function(customerInfo) {
        if (!customerInfo) {
            responseData.code = 2;
            responseData.message = 'username or password is wrong';
            res.json(responseData);
            return;
        }
        responseData.message = 'login successfully';
        responseData.customerInfo = {
            _id: customerInfo._id,
            username: customerInfo.username
        }
        req.cookies.set('customerInfo', JSON.stringify({
            _id: customerInfo._id,
            username: customerInfo.username
        }));
        res.json(responseData);
        return;
    })


});

router.get('/customer/logout', function(req, res) {
    req.cookies.set('customerInfo', null);
    res.json(responseData);
});




//Get specified comments on all articles
router.get('/comment', function(req, res) {
    var restaurantId = req.query.restaurantid || '';
    Restaurant.findOne({
        _id: restaurantId
    }).then(function(restaurant) {
        responseData.data = restaurant.comments;
        res.json(responseData);
    });

});
//submit comment
router.post('/comment/post', function(req, res) {
    //content id
    var restaurantId = req.body.restaurantid || ''; //前端传过来的餐厅的ID
    var postData = {
        username: req.customerInfo.username, //cookie
        postTime: new Date(),
        content: req.body.content //评论的内容
    };

    //Query information about the current restaurant
    Restaurant.findOne({
        _id: restaurantId
    }).then(function(restaurant) {
        restaurant.comments.push(postData);
        return restaurant.save();
    }).then(function(newContent) {
        responseData.message = 'comment successfully';
        responseData.data = newContent;
        res.json(responseData);
    });
});


module.exports = router;