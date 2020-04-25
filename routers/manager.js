var express = require('express');
var router = express.Router();
var Customer = require('../models/Customer');
var Category = require('../models/Category');
var Restaurant = require('../models/Restaurant');
var Menu = require('../models/Menu');


router.use(function(req, res, next) {
    if (!req.customerInfo.isManager) {
        //If the current user is a non-manager
        res.send('sorry,only manager can enter this page');
        return;
    }
    next();
});

router.get('/', function(req, res, next) {
    res.render('manager/index', {
        customerInfo: req.customerInfo
    });
    //res.send('hello');
});

router.get('/menu', function(req, res, next) {
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

            res.render('manager/menu_index', {
                customerInfo: req.customerInfo,
                menus: menus,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
            //console.log(req.customerInfo, restaurants);
        });

    });


});



/*
add menu page
*/

router.get('/menu/add', function(req, res, next) {



    Restaurant.find().then(function(restaurants) {
        res.render('manager/menu_add', {
            customerInfo: req.customerInfo,
            restaurants: restaurants,
        });
    })

});
/*
save menu in database
*/

router.post('/menu/add', function(req, res) {

    //console.log(req.body)
    var meal = req.body.meal || '';
    var price = req.body.price || '';
    var title = req.body.title;
    if (req.body.meal == '') {
        res.render('manager/error', {
            customerInfo: req.customerInfo,
            message: 'meal name cannot be empty'
        })
        return;
    }

    if (req.body.price == '') {
        res.render('manager/error', {
            customerInfo: req.customerInfo,
            message: 'meal price cannot be empty'
        })
        return;
    }

    Menu.findOne({
        meal: meal,
        price: price,
        title: title
    }).then(function(rs) {
        if (rs) {
            res.render('manager/error', {
                customerInfo: req.customerInfo,
                message: 'this record has existed'
            })
            return Promise.reject();
        } else {
            return new Menu({
                meal: meal,
                price: price,
                title: title
            }).save();
        }
    }).then(function(newMenu) {
        res.render('manager/success', {
            customerInfo: req.customerInfo,
            message: 'saved successful!',
            url: '/manager/menu'
        })

    })
});




module.exports = router;