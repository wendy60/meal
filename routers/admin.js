var express = require('express');
var router = express.Router();

var Customer = require('../models/Customer');
var Category = require('../models/Category');
var Restaurant = require('../models/Restaurant');
//judge whether user is admin
router.use(function(req, res, next) {
    if (!req.customerInfo.isAdmin) {
        //If the current user is a non-administrator
        res.send('sorry,only administrator can enter this page');
        return;
    }
    next();
});

/**
 * home page
 */
router.get('/', function(req, res, next) {
    res.render('admin/index', {
        customerInfo: req.customerInfo
    });
});

/*
 * user management
 * */
router.get('/customer', function(req, res) {

    /*
     * read all users' data from the database 
     *
     * limit(Number) : limit the number of data obtained 
     *
     * skip(2) : the number of data ignored
     *
     * show 2 iterms per page
     * 1 : 1-2 skip:0 -> (current page-1) * limit
     * 2 : 3-4 skip:2
     * */

    var page = Number(req.query.page || 1); //current page
    var limit = 10;
    var pages = 0; //number of total pages

    Customer.count().then(function(count) {

        //calculating the total number of pages
        pages = Math.ceil(count / limit);
        //The value cannot exceed pages
        page = Math.min(page, pages);
        //The value cannot be less than 1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit; //ignore the number of data

        Customer.find().limit(limit).skip(skip).then(function(customers) {

            res.render('admin/user_index', {
                customerInfo: req.customerInfo,
                customers: customers,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});

/*
 * category home page
 * */
router.get('/category', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Category.count().then(function(count) {

        //calculating the total number of pages
        pages = Math.ceil(count / limit);
        //The value cannot exceed pages
        page = Math.min(page, pages);
        //The value cannot be less than 1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        /*
         * 1: Ascending order
         * -1: Descending order
         * */
        Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then(function(categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});

/*
 * add category
 * */
router.get('/category/add', function(req, res) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

/*
 * save category
 * */
router.post('/category/add', function(req, res) {

    var name = req.body.name || '';

    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'name cannot be empty'
        });
        return;
    }

    //Whether a category name with the same name already exists in the database
    Category.findOne({
        name: name
    }).then(function(rs) {
        if (rs) {
            //The classification already exists in the database
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'category has existed'
            })
            return Promise.reject();
        } else {
            //The classification does not exist in the database, you can save it
            return new Category({
                name: name
            }).save();
        }
    }).then(function(newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'category saved successfully',
            url: '/admin/category'
        });
    })

});

/*
 * edit category
 * */
router.get('/category/edit', function(req, res) {

    //Get the classification information to be modified and display it in the form of a form
    var id = req.query.id || '';

    //Get the classification information to be modified
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'category information not exist'
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })

});

/*
 * save edit of category
 * */
router.post('/category/edit', function(req, res) {

    //Get the classification information to be modified and display it in the form of a form
    var id = req.query.id || '';
    //Get the name submitted by the post
    var name = req.body.name || '';

    //Get the classification information to be modified
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'category information not exist'
            });
            return Promise.reject();
        } else {
            //When the user does not submit any changes
            if (name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: 'edit successfully',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                //Whether the category name to be modified already exists in the database
                return Category.findOne({
                    _id: { $ne: id },
                    name: name
                });
            }
        }
    }).then(function(sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'A classification with the same name already exists in the database'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'successfully modified ',
            url: '/admin/category'
        });
    })

});

/*
 * delete category
 * */
router.get('/category/delete', function(req, res) {

    //Get the id of the category to delete
    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'delete successfully',
            url: '/admin/category'
        });
    });

});

/*
 * content home page
 * */
router.get('/restaurant', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Restaurant.count().then(function(count) {

        //Calculating the total number of pages
        pages = Math.ceil(count / limit);
        //The value cannot exceed pages
        page = Math.min(page, pages);
        //The value cannot be less than 1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        Restaurant.find().limit(limit).skip(skip).populate(['category', 'restaurant']).sort({
            addTime: -1
        }).then(function(restaurant) {
            res.render('admin/restaurant_index', {
                customerInfo: req.customerInfo,
                restaurant: restaurant,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});

/*
 * add content page
 * */
router.get('/restaurant/add', function(req, res) {

    Category.find().sort({ _id: -1 }).then(function(categories) {
        res.render('admin/restaurant_add', {
            customerInfo: req.customerInfo,
            categories: categories
        })
    });

});

/*
 * save content
 * */
router.post('/restaurant/add', function(req, res) {

    //console.log(req.body)

    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'restaurant category cannot be empty'
        })
        return;
    }

    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'content title cannot be empty'
        })
        return;
    }

    //Save data to database
    new Restaurant({
        category: req.body.category,
        title: req.body.title,
        user: req.customerInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function(rs) {
        res.render('admin/success', {
            customerInfo: req.customerInfo,
            message: 'content saved successfully',
            url: '/admin/restaurant'
        })
    });

});

/*
 * modify content
 * */
router.get('/restaurant/edit', function(req, res) {

    var id = req.query.id || '';

    var categories = [];

    Category.find().sort({ _id: 1 }).then(function(rs) {

        categories = rs;

        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function(content) {

        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'The specified restaurant does not exist'
            });
            return Promise.reject();
        } else {
            res.render('admin/restaurant_edit', {
                userInfo: req.userInfo,
                categories: categories,
                content: content
            })
        }
    });

});

/*
 * save modified content
 * */
router.post('/restaurant/edit', function(req, res) {
    var id = req.query.id || '';

    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'content category cannot be empty'
        })
        return;
    }

    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'content title cannot be empty'
        })
        return;
    }

    Restaurant.update({
        _id: id
    }, {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'content saved successfully',
            url: '/restaurant/edit?id=' + id
        })
    });

});

/*
 * content delete
 * */
router.get('/restaurant/delete', function(req, res) {
    var id = req.query.id || '';

    Restaurant.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'delete successfully',
            url: '/admin/restaurant'
        });
    });
});


module.exports = router;