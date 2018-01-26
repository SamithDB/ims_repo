	
	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	var cookieParser = require('cookie-parser');
	const fileUpload = require('express-fileupload');
		
	connection.query('USE ' + dbconfig.database);


	module.exports = function(app, passport) {



	// =====================================
	// Product page =====================
	// =====================================
	app.get('/propage', isLoggedIn, function(req, res) {
console.log('propage is working');
			connection.query("SELECT * FROM employee WHERE login_idlogin = ?",[req.user.idlogin], function(err, rows) {
                    if (err)
                         console.log(err);

                    res.render('productpage.ejs', {
						user : rows[0], //  pass to template
						message: ""
					});
        });	

		
	});
		// =====================================
	// Product-Details page =====================
	// =====================================
	app.get('/proInfopage', isLoggedIn, function(req, res) {
console.log('proInfopage is working');
			connection.query("SELECT * FROM employee WHERE login_idlogin = ?",[req.user.idlogin], function(err, rows) {
                    if (err)
                         console.log(err);

                    res.render('product_details.ejs', {
						user : rows[0], //  pass to template
						message: ""
					});
        });	
	});
	// =====================================
	// Product-Cart page =====================
	// =====================================
		app.get('/proCart', isLoggedIn, function(req, res) {
console.log('proInfopage is working');
			connection.query("SELECT * FROM employee WHERE login_idlogin = ?",[req.user.idlogin], function(err, rows) {
                    if (err)
                         console.log(err);

                    res.render('product_cart.ejs', {
						user : rows[0], //  pass to template
						message: ""
					});
        });

		
	});

}

// route middleware to make sure
function isLoggedIn(req, res, next) {


	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
		return next();
	}

	// if they aren't redirect them to the home page
	res.redirect('/');
}
