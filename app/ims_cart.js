	
	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	var cookieParser = require('cookie-parser');
	const fileUpload = require('express-fileupload');
		
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
																		cartproducts : cartpros
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

			var insertQuery = "INSERT INTO cartproducts (cartproducts.cart_idcart, cartproducts.inventory_idinventory,cartproducts.qty,cartproducts.unit) values (?,?,?,?)";
			connection.query(insertQuery,[ tocart.cart_idcart, tocart.inventory_idinventory, tocart.qty, tocart.unit],function(err, newprorow) {
			 if (err)
				 console.log(err);

			console.log("Product add to cart!");
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
