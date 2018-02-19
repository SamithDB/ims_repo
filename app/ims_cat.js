// app/ims.js
	
	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	var cookieParser = require('cookie-parser');
	const fileUpload = require('express-fileupload');
		
	connection.query('USE ' + dbconfig.database);


	module.exports = function(app, passport) {

	// =====================================
	// Add categories ======================
	// =====================================
	app.get('/addcat', function(req, res) {
		

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
                    if (err1)
                         console.log(err1);;

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

								        					res.render('addcategories.ejs', {
															user : rows[0],		//  pass to template
															store : storelist,
															category : categorylist,
															generic : genericlist,
															make : makelist,
															brand : brandlist,
															unit : unitlist,
															model: modellist,
															level : req.user.level

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


		app.post('/addcategory', function(req, res) {

			var newcategory = new Object();
			newcategory.name = req.body.name;
			newcategory.description = req.body.desc;
			newcategory.store = req.body.store;

			var insertQuery = "INSERT INTO category (category.name, category.description,category.store_idstore) values (?,?,?)";
			connection.query(insertQuery,[ newcategory.name, newcategory.description,newcategory.store],function(err, rows) {
			 if (err)
				 console.log(err);

			console.log("Done!");
			res.redirect('/addcat'); 

			});

		});	

		app.post('/editcat', function(req, res) {

			var newcategory = new Object();
			newcategory.id = req.body.catid;
			newcategory.name = req.body.catname;
			newcategory.description = req.body.catdes;


			var insertQuery = "UPDATE category SET category.name = ?, category.description = ? WHERE category.idcategory = ?";
			connection.query(insertQuery,[ newcategory.name, newcategory.description,newcategory.id ],function(err, rows) {
				 if (err) {
					console.log(err);
				
				} else {
					
					console.log('edited');
					res.redirect('/addcat'); 
					
				}
			})

		});	

		app.post('/addst', function(req, res) {

			var newstore = new Object();
			newstore.name = req.body.name;
			newstore.description = req.body.desc;

			var insertQuery = "INSERT INTO store (store.name, store.description) values (?,?)";
			connection.query(insertQuery,[ newstore.name, newstore.description ],function(err, rows) {
			 if (err)
				 console.log(err);

			console.log("Done!");
			res.redirect('/addcat'); 

			});

		});

		app.post('/editst', function(req, res) {

			var newstore = new Object();
			newstore.id = req.body.catid;
			newstore.name = req.body.catname;
			newstore.description = req.body.catdes;


			var insertQuery = "UPDATE store SET store.name = ?, store.description = ? WHERE store.idstore = ?";
			connection.query(insertQuery,[ newstore.name, newstore.description,newstore.id ],function(err, rows) {
				 if (err) {
					console.log(err);
				
				} else {
					
					console.log('edited');
					res.redirect('/addcat'); 
					
				}
			})

		});	

		app.post('/addgn', function(req, res) {

			var newgeneric = new Object();
			newgeneric.name = req.body.name;
			newgeneric.description = req.body.desc;
			newgeneric.store = req.body.store;

			var insertQuery = "INSERT INTO generic (generic.name, generic.description, generic.store_idstore) values (?,?,?)";
			connection.query(insertQuery,[ newgeneric.name, newgeneric.description, newgeneric.store ],function(err, rows) {
			 if (err)
				 console.log(err);

			console.log("Done!");
			res.redirect('/addcat'); 

			});

		});

		app.post('/editgn', function(req, res) {

			var newgeneric = new Object();
			newgeneric.id = req.body.catid;
			newgeneric.name = req.body.catname;
			newgeneric.description = req.body.catdes;


			var insertQuery = "UPDATE generic SET generic.name = ?, generic.description = ? WHERE generic.idgeneric = ?";
			connection.query(insertQuery,[ newgeneric.name, newgeneric.description, newgeneric.id ],function(err, rows) {
				 if (err) {
					console.log(err);
				
				} else {
					
					console.log('edited');
					res.redirect('/addcat'); 
					
				}
			})

		});	

		app.post('/addmk', function(req, res) {

			var newmake = new Object();
			newmake.name = req.body.name;
			newmake.description = req.body.desc;
			newmake.store = req.body.store;

			var insertQuery = "INSERT INTO make (make.name, make.description, make.store_idstore) values (?,?,?)";
			connection.query(insertQuery,[ newmake.name, newmake.description, newmake.store ],function(err, rows) {
			 if (err)
				 console.log(err);

			console.log("Done!");
			res.redirect('/addcat'); 

			});

		});

		app.post('/editmk', function(req, res) {

			var newmake = new Object();
			newmake.id = req.body.catid;
			newmake.name = req.body.catname;
			newmake.description = req.body.catdes;


			var insertQuery = "UPDATE make SET make.name = ?, make.description = ? WHERE make.idmake = ?";
			connection.query(insertQuery,[ newmake.name, newmake.description, newmake.id ],function(err, rows) {
				 if (err) {
					console.log(err);
				
				} else {
					
					console.log('edited');
					res.redirect('/addcat'); 
					
				}
			})

		});	

		app.post('/addbr', function(req, res) {

			var newbrand = new Object();
			newbrand.name = req.body.name;
			newbrand.description = req.body.desc;
			newbrand.store = req.body.store;

			var insertQuery = "INSERT INTO brand (brand.name, brand.description, brand.store_idstore) values (?,?,?)";
			connection.query(insertQuery,[ newbrand.name, newbrand.description, newbrand.store ],function(err, rows) {
			 if (err)
				 console.log(err);

			console.log("Done!");
			res.redirect('/addcat'); 

			});

		});

		app.post('/editbr', function(req, res) {

			var newbrand = new Object();
			newbrand.id = req.body.catid;
			newbrand.name = req.body.catname;
			newbrand.description = req.body.catdes;


			var insertQuery = "UPDATE brand SET brand.name = ?, brand.description = ? WHERE brand.idbrand = ?";
			connection.query(insertQuery,[ newbrand.name, newbrand.description, newbrand.id ],function(err, rows) {
				 if (err) {
					console.log(err);
				
				} else {
					
					console.log('edited');
					res.redirect('/addcat'); 
					
				}
			})

		});	

		app.post('/addun', function(req, res) {

			var newunit = new Object();
			newunit.name = req.body.name;
			newunit.description = req.body.desc;
			newunit.store = req.body.store;

			var insertQuery = "INSERT INTO unit (unit.name, unit.description, unit.store_idstore) values (?,?,?)";
			connection.query(insertQuery,[ newunit.name, newunit.description, newunit.store],function(err, rows) {
			 if (err)
				 console.log(err);

			console.log("Done!");
			res.redirect('/addcat'); 

			});

		});

		app.post('/editun', function(req, res) {

			var newunit = new Object();
			newunit.id = req.body.catid;
			newunit.name = req.body.catname;
			newunit.description = req.body.catdes;


			var insertQuery = "UPDATE unit SET unit.name = ?, unit.description = ? WHERE unit.idunit = ?";
			connection.query(insertQuery,[ newunit.name, newunit.description, newunit.id ],function(err, rows) {
				 if (err) {
					console.log(err);
				
				} else {
					
					console.log('edited');
					res.redirect('/addcat'); 
					
				}
			})

		});	

		app.post('/addmd', function(req, res) {

			var newmodel = new Object();
			newmodel.name = req.body.name;
			newmodel.description = req.body.desc;
			newmodel.store = req.body.store;

			var insertQuery = "INSERT INTO model (model.name, model.description, model.store_idstore) values (?,?,?)";
			connection.query(insertQuery,[ newmodel.name, newmodel.description, newmodel.store ],function(err, rows) {
			 if (err)
				 console.log(err);

			console.log("Done!");
			res.redirect('/addcat'); 

			});

		});

		app.post('/editmd', function(req, res) {

			var newmodel = new Object();
			newmodel.id = req.body.catid;
			newmodel.name = req.body.catname;
			newmodel.description = req.body.catdes;


			var insertQuery = "UPDATE model SET model.name = ?, model.description = ? WHERE model.idmodel = ?";
			connection.query(insertQuery,[ newmodel.name, newmodel.description, newmodel.id ],function(err, rows) {
				 if (err) {
					console.log(err);
				
				} else {
					
					console.log('edited');
					res.redirect('/addcat'); 
					
				}
			})

		});	




	// =====================================
	// Add suppliers ======================
	// =====================================

	app.get('/supp', function(req, res) {

		var newview = new Object();
		newview.mail = req.body.searchmail;

				connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
                    if (err1){
                         console.log(err1);
                         
                     }else{

	                    connection.query("SELECT * FROM supplier", function(err2, suppl) {
	                    if (err2)
	                         console.log(err2);

	                     res.render('suppliers.ejs', {
							user : rows[0],	 //  pass to template
							supplier : suppl,
							level : req.user.level
						});

                    });

	                }
                    
        });

		
	});

	app.post('/addsup', function(req, res) {

			var newsupplier = new Object();
			newsupplier.name = req.body.name;
			newsupplier.contact = req.body.cont;
			newsupplier.description = req.body.desc;

			var insertQuery = "INSERT INTO supplier (supplier.name, supplier.contact, supplier.description) values (?,?,?)";
			connection.query(insertQuery,[ newsupplier.name, newsupplier.contact, newsupplier.description ],function(err, rows) {
			 if (err)
				 console.log(err);

			console.log("Done!");
			res.redirect('/supp'); 

			});

		});

	app.post('/editsup', function(req, res) {

			var newsupplier = new Object();
			newsupplier.id = req.body.catid;
			newsupplier.name = req.body.catname;
			newsupplier.cont = req.body.catcon;
			newsupplier.description = req.body.catdes;


			var insertQuery = "UPDATE supplier SET supplier.name = ?, supplier.contact = ?, supplier.description = ? WHERE supplier.idsupplier = ?";
			connection.query(insertQuery,[ newsupplier.name, newsupplier.cont, newsupplier.description, newsupplier.id ],function(err, rows) {
				 if (err) {
					console.log(err);
				
				} else {
					
					console.log('edited');
					res.redirect('/supp'); 
					
				}
			})

		});	
	




	
	}

