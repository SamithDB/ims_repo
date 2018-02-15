	
	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	var cookieParser = require('cookie-parser');
	const fileUpload = require('express-fileupload');
	var math = require('mathjs');
		
	connection.query('USE ' + dbconfig.database);


	module.exports = function(app, passport) {


	// ======================
	// Go to Sell Page ======
	// ======================

		app.get('/sellpage', function(req, res) {

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
                    if (err1)
                         console.log(err1);

			        			var query = connection.query('SELECT * FROM store',function(err2,storelist){
				        		if(err2)
				        			console.log(err2);;

				        			var query = connection.query('SELECT * FROM category',function(err3,categorylist){
				        			if(err3)
				        				console.log(err3);

				        				var query = connection.query('SELECT * FROM generic',function(err4,genericlist){
				        				if(err4)
				        					console.log(err4);

				        					var query = connection.query('SELECT * FROM make',function(err5,makelist){
					        				if(err5)
					        					console.log(err5);

					        					var query = connection.query('SELECT * FROM brand',function(err6,brandlist){
						        				if(err6)
						        					console.log(err6);

						        					var query = connection.query('SELECT * FROM unit',function(err7,unitlist){
							        				if(err7)
							        					console.log(err7);

							        					var query = connection.query('SELECT * FROM model',function(err8,modellist){
								        				if(err8)
								        					console.log(err8);

								        					var query = connection.query('SELECT * FROM supplier',function(err9,supplierlist){
								        					if(err9)
								        						console.log(err9);

								        						var query = connection.query('SELECT * FROM stocklevel',function(err9,stock){
								        						if(err9)
								        							console.log(err9);

								        							var query = connection.query('SELECT * FROM inventory ORDER BY idinventory DESC',function(err10,inventorypro){
								        							if(err10)
								        							console.log(err10);

								        							var query = connection.query("SELECT * FROM invoice WHERE employee_idemployee = ? ",[rows[0].idemployee],function(err11,invlist){
								        							if(err11)
								        								console.log(err11)

								        							if(invlist.length){

								        								var query = connection.query("SELECT * FROM invoiceproducts WHERE invoice_idinvoice = ? ",[invlist[0].idinvoice],function(err12,invpros){
								        								if(err12)
								        									console.log(err12)


								        								res.render('sell_page.ejs', {
																		user : rows[0],		//  pass to template
																		store : storelist,
																		category : categorylist,
																		generic : genericlist,
																		make : makelist,
																		brand : brandlist,
																		unit : unitlist,
																		model: modellist,
																		supplier : supplierlist,
																		inventory : inventorypro,
																		stock : stock,
																		myinv : invlist[0],
																		invproducts : invpros,
																		level : req.user.level
																		});

																		});

								        							}else{

								        								var newinv = new Object();
																		newinv.empid = rows[0].idemployee;

																		var insertQuery = "INSERT INTO invoice (invoice.employee_idemployee) values (?)";
																		connection.query(insertQuery,[ newinv.empid ],function(err, newrow) {
																		if (err)
																			 console.log(err);

																		res.redirect('/sellpage'); 

																		});

								        							}
								        				});
		
								        			});

				        						});

				        					});

				        				});

				        			});

			        			});
				        			
			        		});
                   
        				});

					});		

				});

			});

			
		});

	// ===========================
	// Add to INV ===============
	// ===========================

	app.post('/addbyname', function(req, res) {

			connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
              if (err1)
                console.log(err1);

            var query = connection.query("SELECT * FROM invoice WHERE employee_idemployee = ? ",[rows[0].idemployee],function(err2,invlist){
			  if(err2)
				console.log(err2);

			var query = connection.query("SELECT * FROM inventory WHERE idinventory = ? ",[req.body.pro],function(err3,pro){
			  if(err3)
				console.log(err3);
			
			if(invlist.length){

			var toinv = new Object();
			toinv.invoice_idinvoice = invlist[0].idinvoice;
			toinv.inventory_idinventory = req.body.pro;
			toinv.qty = req.body.qty;
			toinv.unit = pro[0].retailcash;

			var price = math.eval(toinv.qty * toinv.unit);
			var newtotal = math.add(invlist[0].total,price);

			console.log(newtotal);

			var insertQuery = "INSERT INTO invoiceproducts (invoiceproducts.invoice_idinvoice, invoiceproducts.inventory_idinventory,invoiceproducts.qty,invoiceproducts.unit) values (?,?,?,?)";
			connection.query(insertQuery,[ toinv.invoice_idinvoice, toinv.inventory_idinventory, toinv.qty, toinv.unit],function(err, newprorow) {
			 if (err){
				 console.log(err);
			}else{

			console.log("Product add to inv!");

			var insertQuery1 = "UPDATE invoice SET invoice.total = ? WHERE invoice.idinvoice = ?";
			connection.query(insertQuery1,[ newtotal, toinv.invoice_idinvoice],function(err, rows) {
			 if (err) 
				console.log(err);
				
			});

			}

			res.redirect('/sellpage'); 

			});

			}else{

				var newinv = new Object();
				newinv.empid = rows[0].idemployee;

				var insertQuery = "INSERT INTO invoice (invoice.employee_idemployee) values (?)";
				connection.query(insertQuery,[ newinv.empid ],function(err, newrow) {
				if (err)
					console.log(err);

				res.redirect('/sellpage');

				});

			}

			});

			});

			});

		});

	app.post('/addbyserial', function(req, res) {

			connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
              if (err1)
                console.log(err1);

            var query = connection.query("SELECT * FROM invoice WHERE employee_idemployee = ? ",[rows[0].idemployee],function(err2,invlist){
			  if(err2)
				console.log(err2);

			var query = connection.query("SELECT * FROM inventory WHERE itemcode = ? ",[req.body.proserial],function(err3,pro){
			  if(err3)
				console.log(err3);
			
			if(invlist.length){

			var toinv = new Object();
			toinv.invoice_idinvoice = invlist[0].idinvoice;
			toinv.inventory_idinventory = pro[0].idinventory;
			toinv.qty = req.body.qty;
			toinv.unit = pro[0].retailcash;

			var price = math.eval(toinv.qty * toinv.unit);
			var newtotal = math.add(invlist[0].total,price);

			console.log(newtotal);

			var insertQuery = "INSERT INTO invoiceproducts (invoiceproducts.invoice_idinvoice, invoiceproducts.inventory_idinventory,invoiceproducts.qty,invoiceproducts.unit) values (?,?,?,?)";
			connection.query(insertQuery,[ toinv.invoice_idinvoice, toinv.inventory_idinventory, toinv.qty, toinv.unit],function(err, newprorow) {
			 if (err){
				 console.log(err);
			}else{

			console.log("Product add to inv!");

			var insertQuery1 = "UPDATE invoice SET invoice.total = ? WHERE invoice.idinvoice = ?";
			connection.query(insertQuery1,[ newtotal, toinv.invoice_idinvoice],function(err, rows) {
			 if (err) 
				console.log(err);
				
			});

			}

			res.redirect('/sellpage'); 

			});

			}else{

				var newinv = new Object();
				newinv.empid = rows[0].idemployee;

				var insertQuery = "INSERT INTO invoice (invoice.employee_idemployee) values (?)";
				connection.query(insertQuery,[ newinv.empid ],function(err, newrow) {
				if (err)
					console.log(err);

				res.redirect('/sellpage');

				});

			}

			});

			});

			});

		});

	


	// ===========================
	// Change qty in inv ========
	// ===========================

	app.post('/invqty', function(req, res) {

			var newqty = new Object();
			newqty.proid = req.body.proid;
			newqty.qty = req.body.newqty;
			newqty.oldqty = req.body.oldqty;
			newqty.invproid = req.body.invid;
			newqty.unit = req.body.price;
			newqty.inv = req.body.inv;

			console.log(newqty.inv);

			var tot = 0;
			var changingprice = 0;
			var oldtot=req.body.invtot;
			console.log(oldtot);

			if(newqty.qty==newqty.oldqty){

				res.redirect('/sellpage');

			}else if(newqty.qty>newqty.oldqty){

				var insertQuery = "UPDATE invoiceproducts SET invoiceproducts.qty = ? WHERE invoiceproducts.idinvoiceproducts = ?";
				connection.query(insertQuery,[ newqty.qty, newqty.invproid],function(err, rows) {
					if (err){
						console.log(err);
					
						}else{
							changingprice = math.eval((newqty.qty-newqty.oldqty) * newqty.unit);
							tot = math.add(changingprice , oldtot);
							console.log(changingprice);
							console.log(tot);

							var insertQuery1 = "UPDATE invoice SET invoice.total = ? WHERE invoice.idinvoice = ?";
							connection.query(insertQuery1,[ tot, newqty.inv],function(err, rows) {
							if (err) 
								console.log(err);
							
							});
						}
			});

				res.redirect('/sellpage');

			}else if(newqty.qty<newqty.oldqty){

				var insertQuery = "UPDATE invoiceproducts SET invoiceproducts.qty = ? WHERE invoiceproducts.idinvoiceproducts = ?";
				connection.query(insertQuery,[ newqty.qty, newqty.invproid],function(err, rows) {
					if (err){
						console.log(err);
					
						}else{

						    changingprice = math.eval((newqty.oldqty-newqty.qty) * newqty.unit);
						    console.log(tot);
							tot = math.subtract(req.body.invtot , changingprice) ;

							console.log(changingprice);
							console.log(tot);

							var insertQuery1 = "UPDATE invoice SET invoice.total = ? WHERE invoice.idinvoice = ?";
							connection.query(insertQuery1,[ tot, newqty.inv],function(err, rows) {
							if (err) 
								console.log(err);
							
							});

						}
			});

				res.redirect('/sellpage');

			}
			
		});

	// ===========================
	// Remove from the inv ======
	// ===========================

	app.post('/delfrminv', function(req, res) {

		var inv = new Object();
		inv.invid = req.body.inv;
		inv.oldtot = req.body.invtot;
		inv.price = req.body.price;

		var tot = math.subtract(inv.oldtot , inv.price);
		console.log(tot);
		console.log(inv.invid);

		connection.query("DELETE FROM invoiceproducts WHERE idinvoiceproducts = ?",[req.body.delid], function(err, rows) {
			if (err){
				console.log(err);
			}else{
				console.log("Remove from the inv");

				var insertQuery1 = "UPDATE invoice SET invoice.total = ? WHERE invoice.idinvoice = ?";
				connection.query(insertQuery1,[ tot, inv.invid],function(err, rows) {
					if (err) 
						console.log(err);
					
				});
			}

			res.redirect('/sellpage'); 
						                    
						                        
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
