	
	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	var cookieParser = require('cookie-parser');
	const fileUpload = require('express-fileupload');
	var math = require('mathjs');
		
	connection.query('USE ' + dbconfig.database);


	module.exports = function(app, passport) {


	// ===========================
	// View Cart =================
	// ===========================
	app.get('/viewcart', isLoggedIn, function(req, res) {

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

								        							var query = connection.query("SELECT * FROM cart WHERE employee_idemployee = ? ",[rows[0].idemployee],function(err11,cartlist){
								        							if(err11)
								        								console.log(err11)

								        							if(cartlist.length){

								        								var query = connection.query("SELECT * FROM cartproducts WHERE cart_idcart = ? ",[cartlist[0].idcart],function(err12,cartpros){
								        								if(err12)
								        								console.log(err12)

								        								res.render('product_cart.ejs', {
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
																		mycart : cartlist[0],
																		cartproducts : cartpros,
																		level : req.user.level
																		});

																		});

								        							}else{

								        								var newcart = new Object();
																		newcart.empid = rows[0].idemployee;

																		var insertQuery = "INSERT INTO cart (cart.employee_idemployee) values (?)";
																		connection.query(insertQuery,[ newcart.empid ],function(err, newrow) {
																		 if (err)
																			 console.log(err);

																		res.redirect('/viewcart'); 

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
	// Add to Cart ===============
	// ===========================

	app.post('/addtocart', function(req, res) {

			connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
              if (err1)
                console.log(err1);

            var query = connection.query("SELECT * FROM cart WHERE employee_idemployee = ? ",[rows[0].idemployee],function(err2,cartlist){
			  if(err2)
				console.log(err2);

			if(cartlist.length){

			var tocart = new Object();
			tocart.cart_idcart = cartlist[0].idcart;
			tocart.inventory_idinventory = req.body.proid;
			tocart.qty = req.body.crtqty;
			tocart.unit = req.body.unit;

			console.log(tocart.cart_idcart);
			console.log(tocart.inventory_idinventory);

			var price = math.eval(tocart.qty * req.body.unit);
			var newtotal = math.add(cartlist[0].total , price);

			console.log(newtotal);

			var insertQuery = "INSERT INTO cartproducts (cartproducts.cart_idcart, cartproducts.inventory_idinventory,cartproducts.qty,cartproducts.unit) values (?,?,?,?)";
			connection.query(insertQuery,[ tocart.cart_idcart, tocart.inventory_idinventory, tocart.qty, tocart.unit],function(err, newprorow) {
			 if (err){
				 console.log(err);
			}else{

			console.log("Product add to cart!");

			var insertQuery1 = "UPDATE cart SET cart.total = ? WHERE cart.idcart = ?";
			connection.query(insertQuery1,[ newtotal, tocart.cart_idcart],function(err, rows) {
				if (err) 
					console.log(err);
				
			});

			}

			res.redirect('/viewcart'); 

			});

			}else{

				var newcart = new Object();
				newcart.empid = rows[0].idemployee;

				var insertQuery = "INSERT INTO cart (cart.employee_idemployee) values (?)";
				connection.query(insertQuery,[ newcart.empid ],function(err, newrow) {
				 if (err)
					console.log(err);

				res.redirect('/addtocart'); 

				});

			}

			});

			});

		});


	// ===========================
	// Change qty in cart ========
	// ===========================

	app.post('/cartqty', function(req, res) {

			var newqty = new Object();
			newqty.proid = req.body.proid;
			newqty.qty = req.body.newqty;
			newqty.oldqty = req.body.oldqty;
			newqty.cartid = req.body.crtid;
			newqty.unit = req.body.price;

			var tot = req.body.crttot;
			var changingprice = 0;

			if(newqty.qty==newqty.oldqty){

				res.redirect('/viewcart');

			}else if(newqty.qty>newqty.oldqty){

				var insertQuery = "UPDATE cartproducts SET cartproducts.qty = ? WHERE cartproducts.idcartproducts = ?";
				connection.query(insertQuery,[ newqty.qty, newqty.proid],function(err, rows) {
					if (err){
						console.log(err);
					
						}else{
							changingprice = math.eval((newqty.qty-newqty.oldqty) * newqty.unit);
							console.log(changingprice);
							tot = math.add(req.body.crttot , changingprice) ;
							console.log(tot);

							var insertQuery1 = "UPDATE cart SET cart.total = ? WHERE cart.idcart = ?";
							connection.query(insertQuery1,[ tot, newqty.cartid],function(err, rows) {
							if (err) 
								console.log(err);
							
							});

						}
			});

				res.redirect('/viewcart');

			}else if(newqty.qty<newqty.oldqty){

				var insertQuery = "UPDATE cartproducts SET cartproducts.qty = ? WHERE cartproducts.idcartproducts = ?";
				connection.query(insertQuery,[ newqty.qty, newqty.proid],function(err, rows) {
					if (err){
						console.log(err);
					
						}else{
							changingprice = math.eval((newqty.oldqty-newqty.qty) * newqty.unit);
							console.log(changingprice);
							tot = math.subtract(req.body.crttot , changingprice) ;
							console.log(tot);

							var insertQuery1 = "UPDATE cart SET cart.total = ? WHERE cart.idcart = ?";
							connection.query(insertQuery1,[ tot, newqty.cartid],function(err, rows) {
							if (err) 
								console.log(err);
							
							});

						}
			});

				res.redirect('/viewcart');

			}
			
		});

	// ===========================
	// Remove from the cart ======
	// ===========================

	app.post('/delfrmcart', function(req, res) {

		console.log(req.body.delid);
		var cart = new Object();
		cart.crtid = req.body.crtid;
		cart.oldtot = req.body.crttot;
		cart.price = req.body.price;

		var tot = math.subtract(cart.oldtot , cart.price);
		console.log(tot);
		console.log(cart.crtid);

		connection.query("DELETE FROM cartproducts WHERE idcartproducts = ?",[req.body.delid], function(err, rows) {
			if (err){
				console.log(err);
			}else{
				console.log("Remove from the cart");

				var insertQuery1 = "UPDATE cart SET cart.total = ? WHERE cart.idcart = ?";
				connection.query(insertQuery1,[ tot, cart.crtid],function(err, rows) {
					if (err) 
						console.log(err);
					
				});
			}

			res.redirect('/viewcart'); 
						                    
						                        
				});

			
		});

	// ===========================
	// Confirm from the cart =====
	// ===========================

	app.get('/concart', function(req, res) {

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
            	console.log(err1);

            connection.query("SELECT * FROM cart WHERE employee_idemployee = ? ",[rows[0].idemployee],function(err2,cartlist){
			  if(err2)
				console.log(err2);

				connection.query("SELECT * FROM cartproducts WHERE cart_idcart = ? ",[cartlist[0].idcart],function(err3,cartprolist){
			  	if(err3)
					console.log(err3);


					var newinv = new Object();
					newinv.empid = rows[0].idemployee;

					var now = new Date(); 
                    var datetime = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate(); 
                    datetime += ' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds(); 

                    console.log(datetime);

					var insertQuery = "INSERT INTO invoice (invoice.employee_idemployee , invoice.date) values (?,?)";
					connection.query(insertQuery,[ newinv.empid, datetime ],function(err, newinvrow) {
					if (err)
						console.log(err);

					if(cartprolist.length){
					for(var i = 0;i < cartprolist.length;i++) { 

						var toinv = new Object();
						toinv.invoice_idinvoice = newinvrow.insertId;
						toinv.inventory_idinventory = cartprolist[i].inventory_idinventory;
						toinv.qty = cartprolist[i].qty;
						toinv.unit = cartprolist[i].unit;

						var insertQuery = "INSERT INTO invoiceproducts (invoiceproducts.invoice_idinvoice, invoiceproducts.inventory_idinventory,invoiceproducts.qty,invoiceproducts.unit) values (?,?,?,?)";
						connection.query(insertQuery,[ toinv.invoice_idinvoice, toinv.inventory_idinventory, toinv.qty, toinv.unit],function(err, newprorow) {
						if (err)
							console.log(err);

							var insertQuery1 = "UPDATE invoice SET invoice.total = ? WHERE invoice.idinvoice = ?";
							connection.query(insertQuery1,[ cartlist[0].total, newinvrow.insertId],function(err, rows) {
							if (err) 
								console.log(err);

							console.log("Total is set to invoice");
							});

							});

						}
					}

					if(cartprolist.length){
					for(var i = 0;i < cartprolist.length;i++) {
						connection.query("DELETE FROM cartproducts WHERE idcartproducts = ?",[cartprolist[i].idcartproducts], function(err, rows) {
						console.log("deleted.........");
						});

						}

						var insertQuery1 = "UPDATE cart SET cart.total = ? WHERE cart.idcart = ?";
						connection.query(insertQuery1,[ 0, cartlist[0].idcart],function(err, rows) {
						 if (err) 
							console.log(err);

						 console.log("Total is 0");
							});
						}


						res.redirect('/viewmyinv');

					
				    });
			    });	
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
