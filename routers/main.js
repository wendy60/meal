var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Restaurant = require('../models/Restaurant');

var data;

/*
 * deal with general data
 * */
router.use(function(req, res, next) {
    data = {
        customerInfo: req.customerInfo,
        categories: []
    }

    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
});

/*
 * home page
 * */
router.get('/', function(req, res, next) {

    //console.log(req.customerInfo);
    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 2;
    data.pages = 0;

    var where = {};
    if (data.category) {
        where.category = data.category
    }

    Restaurant.where(where).count().then(function(count) {

        data.count = count;
        //Calculating the total number of pages
        data.pages = Math.ceil(data.count / data.limit);
        //The value cannot exceed pages
        data.page = Math.min(data.page, data.pages);
        //The value cannot be less than 1
        data.page = Math.max(data.page, 1);

        var skip = (data.page - 1) * data.limit;

        return Restaurant.where(where).find().limit(data.limit).skip(skip).populate(['category', 'customer']).sort({
            addTime: -1
        });

    }).then(function(restaurants) {
        data.restaurants = restaurants;
        res.render('main/index', data);
    })
});

router.get('/view', function(req, res) {

    var restaurantId = req.query.restaurantid || '';

    Restaurant.findOne({
        _id: restaurantId
    }).then(function(restaurant) {
        data.restaurant = restaurant;

        restaurant.views++;
        restaurant.save();
        //console.log(data);

        res.render('main/view', data);
    });

});

router.get('/chat', function(req, res, next) {
    var username = req.customerInfo.username;
    //console.log(username)
    res.render('main/chat_index', { username: username });
})
module.exports = router;