	
	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	var cookieParser = require('cookie-parser');
	const fileUpload = require('express-fileupload');
	var math = require('mathjs');
		
	connection.query('USE ' + dbconfig.database);


	module.exports = function(app, passport) {

	// ===========================
	// My Invoices Page ======
	// ===========================

	app.get('/viewcus', function(req, res) {

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
              	console.log(err1);

			var query = connection.query("SELECT * FROM invoice WHERE employee_idemployee = ? ORDER BY idinvoice DESC",[rows[0].idemployee],function(err2,invlist){
				if(err2)
					console.log(err2);

					if(invlist.length){
					res.render('myinvoices.ejs', {
					user : rows[0],		//  pass to template
					myinv : invlist,
					level : req.user.level
					});
					}else{
						res.redirect('/home');
					}

				});
			
		});

	});

	// ===========================
	// customers =================
	// ===========================

	app.get('/cus', function(req, res) {

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
              	console.log(err1);

            connection.query("SELECT * FROM employee", function(err1, emplist) {
            if (err1)
              	console.log(err1);

			var query = connection.query("SELECT * FROM login WHERE level = 'admin' ",function(err2,usrlist){
				if(err2)
					console.log(err2);

					if(usrlist.length){
					res.render('customers.ejs', {
					user : rows[0],		//  pass to template
					usrlist : usrlist,
					emp : emplist,
					level : req.user.level
					});
					}else{
						res.redirect('/home');
					}

				});
			})
		});

	});

	// ===========================
	// Pending Invoices ======
	// ===========================

	app.get('/pendinginv', function(req, res) {

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
              	console.log(err1);

            connection.query("SELECT * FROM employee", function(err1, emplist) {
            if (err1)
              	console.log(err1);

			var query = connection.query("SELECT * FROM invoice WHERE invoice.status = 'A' ORDER BY idinvoice DESC",function(err2,invlist){
				if(err2)
					console.log(err2);

					if(invlist.length){
					res.render('pendinginvoices.ejs', {
					user : rows[0],		//  pass to template
					inv : invlist,
					emp : emplist,
					level : req.user.level
					});
					}else{
						res.redirect('/home');
					}

				});
			});
		});

	});

	// ===========================
	// Pending payment Invoices ==
	// ===========================

	app.get('/payinv', function(req, res) {

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
              	console.log(err1);

            connection.query("SELECT * FROM employee", function(err1, emplist) {
            if (err1)
              	console.log(err1);

			var query = connection.query("SELECT * FROM invoice WHERE invoice.status = 'B' ORDER BY idinvoice DESC",function(err2,invlist){
				if(err2)
					console.log(err2);

					if(invlist.length){
					res.render('payforinvoices.ejs', {
					user : rows[0],		//  pass to template
					inv : invlist,
					emp : emplist,
					level : req.user.level
					});
					}else{
						res.redirect('/home');
					}

				});
			});
		});

	});

	// ===========================
	// Print Invoices ======
	// ===========================

	app.post('/printinv', function(req, res) {

		console.log(req.body.invid);

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
              	console.log(err1);
              connection.query("SELECT * FROM employee ", function(err1, emplist) {
	            if (err1)
	              	console.log(err1);

				var query = connection.query("SELECT * FROM invoice WHERE invoice.idinvoice = ? ",[req.body.invid],function(err2,invlist){
				if(err2)
					console.log(err2);

				var query = connection.query("SELECT * FROM invoiceproducts WHERE invoiceproducts.invoice_idinvoice = ? ",[req.body.invid],function(err2,invprolist){
				if(err2)
					console.log(err2);

					var query = connection.query("SELECT * FROM inventory ",function(err2,inventory){
					if(err2)
						console.log(err2);

					if(invlist.length){
					res.render('invoice_print.ejs', {
					user : rows[0],		//  pass to template
					inv : invlist[0],
					invpro: invprolist,
					level : req.user.level,
					emp : emplist,
					inventory : inventory
					});
					}else{
						res.redirect('/home');
					}

					});

					});

				});

			});
			
		});

	});

	// ===========================
	// View Invoice ============
	// ===========================

	app.post('/viewinv', function(req, res) {

		console.log(req.body.invid);

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
              	console.log(err1);
              connection.query("SELECT * FROM employee ", function(err1, emplist) {
	            if (err1)
	              	console.log(err1);

				var query = connection.query("SELECT * FROM invoice WHERE invoice.idinvoice = ? ",[req.body.invid],function(err2,invlist){
				if(err2)
					console.log(err2);

				var query = connection.query("SELECT * FROM invoiceproducts WHERE invoiceproducts.invoice_idinvoice = ? ",[req.body.invid],function(err2,invprolist){
				if(err2)
					console.log(err2);

					var query = connection.query("SELECT * FROM inventory ",function(err2,inventory){
					if(err2)
						console.log(err2);

					if(invlist.length){
					res.render('viewinvoice.ejs', {
					user : rows[0],		//  pass to template
					inv : invlist[0],
					invpro: invprolist,
					level : req.user.level,
					emp : emplist,
					inventory : inventory
					});
					}else{
						res.redirect('/home');
					}

					});

					});

				});

			});
			
		});

	});

	// ===========================
	// Apprv Invoices ======
	// ===========================

	app.post('/apprvinv', function(req, res) {

		var inv = new Object();
		inv.invid = req.body.invid;

		var insertQuery1 = "UPDATE invoice SET invoice.status = ? WHERE invoice.idinvoice = ?";
		connection.query(insertQuery1,[ "B", inv.invid],function(err, rows) {
		if (err) 
			console.log(err);
					
		});
			

		res.redirect('/pendinginv'); 
			
		});


	// ===========================
	// Payments for Invoices =====
	// ===========================

	app.post('/getpay', function(req, res) {

		var inv = new Object();
		inv.invid = req.body.invid;

		var insertQuery1 = "UPDATE invoice SET invoice.status = ? WHERE invoice.idinvoice = ?";
		connection.query(insertQuery1,[ "C", inv.invid],function(err, rows) {
		if (err) 
			console.log(err);
					
		});
			

		res.redirect('/pendinginv'); 
			
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
