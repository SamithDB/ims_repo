	
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

								        						var query = connection.query('SELECT * FROM stocklevel',function(err10,stock){
								        						if(err10)
								        							console.log(err10);

								        							var query = connection.query('SELECT * FROM inventory ORDER BY idinventory DESC',function(err11,inventorylist){
								        							if(err11)
								        								console.log(err11);

								        								var query = connection.query("SELECT * FROM cart WHERE employee_idemployee = ? ",[rows[0].idemployee],function(err12,cartlist){
								        								if(err12)
								        									console.log(err12);

								        								if(cartlist.length){

								        								res.render('productpage.ejs', {
																		user : rows[0],		//  pass to template
																		store : storelist,
																		category : categorylist,
																		generic : genericlist,
																		make : makelist,
																		brand : brandlist,
																		unit : unitlist,
																		model: modellist,
																		supplier : supplierlist,
																		inventory : inventorylist,
																		stock : stock,
																		mycart : cartlist[0]

																		});

																		}else{

																		var newcart = new Object();
																		newcart.empid = rows[0].idemployee;

																		var insertQuery = "INSERT INTO cart (cart.employee_idemployee) values (?)";
																		connection.query(insertQuery,[ newcart.empid ],function(err, newrow) {
																		 if (err)
																			console.log(err);

																		res.redirect('/propage');

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


	// =====================================
	// Product detail page =================
	// =====================================
	app.post('/viewproduct', isLoggedIn, function(req, res) {

			console.log(req.body.productid);


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

								        							var query = connection.query("SELECT * FROM inventory WHERE idinventory = ? ",[req.body.productid],function(err10,inventorypro){
								        							if(err10)
								        								console.log(err10);

								        							console.log(inventorypro);

								        							var query = connection.query("SELECT * FROM cart WHERE employee_idemployee = ? ",[rows[0].idemployee],function(err12,cartlist){
								        								if(err12)
								        									console.log(err12);

								        							if(cartlist.length){

								        							res.render('product_details.ejs', {
																		user : rows[0],		//  pass to template
																		store : storelist,
																		category : categorylist,
																		generic : genericlist,
																		make : makelist,
																		brand : brandlist,
																		unit : unitlist,
																		model: modellist,
																		supplier : supplierlist,
																		inventory : inventorypro[0],
																		stock : stock,
																		mycart : cartlist[0]

																		});

								        							}else{

								        								var newcart = new Object();
																		newcart.empid = rows[0].idemployee;

																		var insertQuery = "INSERT INTO cart (cart.employee_idemployee) values (?)";
																		connection.query(insertQuery,[ newcart.empid ],function(err, newrow) {
																		 if (err)
																			console.log(err);

																		res.redirect('/viewproduct');
																		
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

	// =================================
	// Search page =====================
	// =================================
	app.post('/prosearch', isLoggedIn, function(req, res) {

		console.log(req.body.word);
		console.log(req.body.cat);

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

								        						var query = connection.query('SELECT * FROM stocklevel',function(err10,stock){
								        						if(err10)
								        							console.log(err10);

								        						 var query = connection.query("SELECT idcategory FROM category WHERE name = ?",[req.body.cat],function(err13,catid){
												        			if(err13)
												        				console.log(err13);

												        			console.log(catid[0].idcategory);

								        							var query = connection.query("SELECT * FROM inventory WHERE category_idcategory= ? && name LIKE ? ORDER BY idinventory DESC",[catid[0].idcategory,"%"+req.body.word+"%"],function(err11,inventorylist){
								        							if(err11)
								        								console.log(err11);

								        								var query = connection.query("SELECT * FROM cart WHERE employee_idemployee = ? ",[rows[0].idemployee],function(err12,cartlist){
								        								if(err12)
								        									console.log(err12);

								        								if(cartlist.length){

								        								res.render('productsearchpage.ejs', {
																		user : rows[0],		//  pass to template
																		store : storelist,
																		category : categorylist,
																		generic : genericlist,
																		make : makelist,
																		brand : brandlist,
																		unit : unitlist,
																		model: modellist,
																		supplier : supplierlist,
																		inventory : inventorylist,
																		stock : stock,
																		mycart : cartlist[0]

																		});

																		}else{

																		var newcart = new Object();
																		newcart.empid = rows[0].idemployee;

																		var insertQuery = "INSERT INTO cart (cart.employee_idemployee) values (?)";
																		connection.query(insertQuery,[ newcart.empid ],function(err, newrow) {
																		 if (err)
																			console.log(err);

																		res.redirect('/prosearch');

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

		
	});

	// =================================
	// Search page for Side Bar ========
	// =================================
	app.post('/prosearchside', isLoggedIn, function(req, res) {

		console.log(req.body.name);
		console.log(req.body.id);
		var searchtxt = "SELECT * FROM inventory WHERE "+req.body.name+"="+req.body.id;
		console.log(searchtxt);

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

								        						var query = connection.query('SELECT * FROM stocklevel',function(err10,stock){
								        						if(err10)
								        							console.log(err10);

								        							var query = connection.query(searchtxt,function(err11,inventorylist){
								        							if(err11)
								        								console.log(err11);

								        								var query = connection.query("SELECT * FROM cart WHERE employee_idemployee = ? ",[rows[0].idemployee],function(err12,cartlist){
								        								if(err12)
								        									console.log(err12);

								        								if(cartlist.length){

								        								res.render('productsearchpage.ejs', {
																		user : rows[0],		//  pass to template
																		store : storelist,
																		category : categorylist,
																		generic : genericlist,
																		make : makelist,
																		brand : brandlist,
																		unit : unitlist,
																		model: modellist,
																		supplier : supplierlist,
																		inventory : inventorylist,
																		stock : stock,
																		mycart : cartlist[0]

																		});

																		}else{

																		var newcart = new Object();
																		newcart.empid = rows[0].idemployee;

																		var insertQuery = "INSERT INTO cart (cart.employee_idemployee) values (?)";
																		connection.query(insertQuery,[ newcart.empid ],function(err, newrow) {
																		 if (err)
																			console.log(err);

																		res.redirect('/prosearch');

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
