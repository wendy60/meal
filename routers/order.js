var express = require('express');
var router = express.Router();
var Customer = require('../models/Customer');
var Category = require('../models/Category');
var Restaurant = require('../models/Restaurant');
var Menu = require('../models/Menu');
var Bill = require('../models/Bill');


router.get('/', function(req, res, next) {
    res.render('customer/index', {
        customerInfo: req.customerInfo
    });
});

router.get('/meal', function(req, res, next) {

    var page = Number(req.query.page || 1); //current page
    var limit = 10;
    var pages = 0; //number of total pages

    Menu.count().then(function(count) {

        //calculating the total number of pages
        pages = Math.ceil(count / limit);
        //The value cannot exceed pages
        page = Math.min(page, pages);
        //The value cannot be less than 1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit; //ignore the number of data
        Menu.find().limit(limit).skip(skip).then(function(menus) {

            res.render('customer/meal', {
                customerInfo: req.customerInfo,
                menus: menus,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    });
});

router.get('/meal/add', function(req, res, next) {


    Menu.find().then(function(menus) {
        res.render('customer/meal_add', {
            customerInfo: req.customerInfo,
            menus: menus
        });

    })

});

router.post('/meal/add', function(req, res) {

    var restaurant = req.body.restaurant;
    var meal = req.body.meal;
    var dining_style = req.body.dining_style;
    var payment_method = req.body.payment_method;
    //var total_price = req.body.price;
    //console.log(req.body)
    Bill.findOne({
        restaurant: restaurant,
        meal: meal,
        dining_style: dining_style,
        payment_method: payment_method,
        //total_price: total_price,
    }).then(function(rs) {
        if (rs) {
            res.render('manager/error', {
                customerInfo: req.customerInfo,
                message: 'this record has existed'
            })
            return Promise.reject();
        } else {
            return new Bill({
                restaurant: restaurant,
                meal: meal,
                dining_style: dining_style,
                payment_method: payment_method,
                //total_price: total_price
            }).save();
        }
    }).then(function(newBill) {
        res.render('manager/success', {
            customerInfo: req.customerInfo,
            message: 'saved successful!',
            url: '/order/meal/record'
        })

    })
});

router.get('/meal/record', function(req, res, next) {

    var page = Number(req.query.page || 1); //current page
    var limit = 10;
    var pages = 0; //number of total pages

    Bill.count().then(function(count) {

        //calculating the total number of pages
        pages = Math.ceil(count / limit);
        //The value cannot exceed pages
        page = Math.min(page, pages);
        //The value cannot be less than 1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit; //ignore the number of data
        Bill.find().then(function(bills) {
            res.render('customer/record', {
                customerInfo: req.customerInfo,
                bills: bills,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        })
    });





})

module.exports = router;