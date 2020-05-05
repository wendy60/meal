//Application startup entry file
var express = require('express'); //load express module
var swig = require('swig'); //load template processing module
var mongoose = require('mongoose');
var bodyParser = require('body-parser') //load http request body parsing middleware
var cookies = require('cookies');
var socket = require('socket.io');


var app = express(); //create app 
//setting up static file hosting
var Restaurant = require('./models/Restaurant');
var Customer = require('./models/Customer');
var server = app.listen(9001, function() {
    console.log('listening to requests on the port 9001');
});
var io = socket(server);
//var io = socket.listen(server);

app.use('/public', express.static(__dirname + '/public')); //load static resource files

//Configure application template
//defines the template engine used by the current application
app.engine('html', swig.renderFile);

//set the directory where template files are stored
app.set('views', './views');
//template engine used for registration
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: true })) //parsing text documents
    //set cookie
app.use(function(req, res, next) {
    req.cookies = new cookies(req, res);
    //parser cookie information for login user
    req.customerInfo = {};
    if (req.cookies.get('customerInfo')) {
        try {
            req.customerInfo = JSON.parse(req.cookies.get('customerInfo'));

            Customer.findById(req.customerInfo._id).then(function(customerInfo) {
                req.customerInfo.isAdmin = Boolean(customerInfo.isAdmin);
                req.customerInfo.isManager = Boolean(customerInfo.isManager);

                next();
            })

        } catch (e) {
            next();
        }
    } else {
        next();
    }
    //console.log(req.customerInfo);
    return req.customerInfo;
});


// add swig
swig.setDefaults({ cache: false });
//set up routers
app.use('/admin', require('./routers/admin'));
app.use('/restaurant', require('./routers/restaurant'));
app.use('/customer', require('./routers/customer'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));
app.use('/order', require('./routers/order'));
app.use('/manager', require('./routers/manager'));


//set root router
app.get('/', function(req, res, next) {
    //res.send('<h1>welcome to my blog!</h1>');
    //read the specified file under views, parse it and return it to the client
    res.render('index', );
})

// app.get('/order', function(req, res, next) {
//     //res.send('<h1>welcome to order meal in our website</h1>');
//     res.render('customer/index', { customerInfo: req.customerInfo });
// })

// app.get('/manager', function(req, res, next) {
//     res.send('<h1>welcome to order meal in our website</h1>');
//     //res.render('manager/index', { customerInfo: req.customerInfo });
// })





//connect database
mongoose.connect("mongodb://localhost:27017/restaurant", (err) => {
    if (err) {
        console.log('database connection failure');
    } else {
        console.log('database connection successful');
        app.listen(9000);
    }
});
//connect WebSocket
io.on('connection', function(socket) {
    console.log('made socket connection', socket.id);


    //handle chat event
    socket.on('chat', function(data) {
        io.sockets.emit('chat', data);
    });

    //handle tyoing event
    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', data);
    });
});