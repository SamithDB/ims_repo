// server.js

// set up ======================================================================
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 80;

var passport = require('passport');
var flash    = require('connect-flash');

var MySQLStore = require('express-mysql-session')(session);
 
var options = {
    host: 'us-cdbr-iron-east-05.cleardb.net',
    port: 3306,
    user: 'b8c071383a7495',
    password: 'd24ea994',
    database: 'heroku_9770229205f81a9'
};
 
var sessionStore = new MySQLStore(options);
// configuration ===============================================================
// connect to database

require('./config/passport')(passport); // pass passport for configuration

app.use('/cssFiles', express.static(__dirname + '/assets')); // for CSS
app.use('/cssFilespro', express.static(__dirname + '/assets/productpage/'));
app.use('/pics', express.static(__dirname + '/propics')); 
app.use('/productpics', express.static(__dirname + '/products'));
app.use('/promos', express.static(__dirname + '/promos'));
app.use('/public', express.static(__dirname + '/public')); 

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/ims_cat.js')(app, passport); 
require('./app/ims_grn.js')(app, passport); 
require('./app/ims_product.js')(app, passport); 
require('./app/customer_routs.js')(app, passport);
require('./app/ims_cart.js')(app, passport);
require('./app/ims_inv.js')(app, passport);
require('./app/ims_payments.js')(app, passport);


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
