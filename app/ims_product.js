// app/ims.js
	
	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	var cookieParser = require('cookie-parser');
	const fileUpload = require('express-fileupload');
		
	connection.query('USE ' + dbconfig.database);


	module.exports = function(app, passport) {

	// =====================================
	// Add product ======================
	// =====================================

	app.get('/newproductstart', function(req, res) {
		

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
                    if (err1)
                         console.log(err1);

			        			var query = connection.query('SELECT * FROM store',function(err2,storelist){
				        		if(err2)
				        			console.log(err2);

				        		res.render('addproductstart.ejs', {
									user : rows[0],		//  pass to template
									store : storelist,
									level : req.user.level

								});

				        				

					});

			});

	});

	app.post('/newproduct', function(req, res) {

		var store = req.body.store;
		console.log(store);

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
                    if (err1)
                         console.log(err1);

			        			var query = connection.query('SELECT * FROM store where idstore = ?',[store],function(err2,storelist){
				        		if(err2)
				        			console.log(err2);;

				        			var query = connection.query('SELECT * FROM category where store_idstore = ?',[store],function(err3,categorylist){
				        			if(err3)
				        				console.log(err3);

				        				var query = connection.query('SELECT * FROM generic where store_idstore = ?',[store],function(err4,genericlist){
				        				if(err4)
				        					console.log(err4);

				        					var query = connection.query('SELECT * FROM make where store_idstore = ?',[store],function(err5,makelist){
					        				if(err5)
					        					console.log(err5);

					        					var query = connection.query('SELECT * FROM brand where store_idstore = ?',[store],function(err6,brandlist){
						        				if(err6)
						        					console.log(err6);

						        					var query = connection.query('SELECT * FROM unit where store_idstore = ?',[store],function(err7,unitlist){
							        				if(err7)
							        					console.log(err7);

							        					var query = connection.query('SELECT * FROM model where store_idstore = ?',[store],function(err8,modellist){
								        				if(err8)
								        					console.log(err8);

								        					var query = connection.query('SELECT * FROM supplier where store_idstore = ?',[store],function(err9,supplierlist){
								        					if(err9)
								        						console.log(err9);

								        							var query = connection.query('SELECT * FROM inventory',function(err10,inventorylist){
								        							if(err10)
								        							console.log(err10);

								        							res.render('addproduct.ejs', {
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

			});

		});
	

	// ==================================
	// Add product ======================
	// ==================================

	app.post('/addnewproduct', function(req, res) {

		var newinventory = new Object();
		newinventory.log = req.user.idlogin;
		newinventory.serial = req.body.serial;
		newinventory.name = req.body.name;
		newinventory.cost = req.body.cost;
		newinventory.retailprice = req.body.retailprice;
		newinventory.retailcredit = req.body.retailcredit;
		newinventory.qty = 0;

		connection.query("SELECT store.idstore FROM store WHERE store.name = ?",[req.body.store], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.store = result[0].idstore;

        connection.query("SELECT category.idcategory FROM category WHERE category.name = ?",[req.body.category], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.category = result[0].idcategory;

        connection.query("SELECT generic.idgeneric FROM generic WHERE generic.name = ?",[req.body.generic], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.generic = result[0].idgeneric;

        connection.query("SELECT brand.idbrand FROM brand WHERE brand.name = ?",[req.body.brand], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.brand = result[0].idbrand;

        connection.query("SELECT make.idmake FROM make WHERE make.name = ?",[req.body.make], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.make = result[0].idmake;

        connection.query("SELECT model.idmodel FROM model WHERE model.name = ?",[req.body.model], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.model = result[0].idmodel;

        connection.query("SELECT unit.idunit FROM unit WHERE unit.name = ?",[req.body.unit], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.unit = result[0].idunit;

        connection.query("SELECT supplier.idsupplier FROM supplier WHERE supplier.name = ?",[req.body.supplier], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.supplier = result[0].idsupplier;
		

			var insertQuery = "INSERT INTO inventory (inventory.itemcode,inventory.name,inventory.store_idstore,inventory.category_idcategory,inventory.generic_idgeneric,inventory.brand_idbrand,inventory.make_idmake,inventory.model_idmodel,inventory.unit_idunit,inventory.supplier_idsupplier,inventory.costprice,inventory.retailcash,inventory.retailcredit) values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
			connection.query(insertQuery,[newinventory.serial,newinventory.name,newinventory.store,newinventory.category,newinventory.generic,newinventory.brand,newinventory.make,newinventory.model,newinventory.unit,newinventory.supplier,newinventory.cost,newinventory.retailprice,newinventory.retailcredit],function(err1, insertedrow) {
				if (err1)
					console.log(err1);

			newinventory.idinventory=insertedrow.insertId;
			var insertQuery = "INSERT INTO stocklevel (stocklevel.qty, stocklevel.inventory_idinventory) values (?,?)";
			connection.query(insertQuery,[newinventory.qty, newinventory.idinventory],function(errr, stockresult) {
				if (errr)
					console.log(errr);


			res.redirect('/newgrn');

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
	// Add product with full details =======
	// =====================================

	

	app.post('/addnewproductfull', function(req, res) {


		var newinventory = new Object();
		newinventory.log = req.user.idlogin;
		newinventory.serial = req.body.serial;
		newinventory.name = req.body.name;
		newinventory.des = req.body.des;
		newinventory.cost = req.body.cost;
		newinventory.retailprice = req.body.retailprice;
		newinventory.retailcredit = req.body.retailcredit;
		newinventory.warentyno = req.body.warentyno;
		newinventory.warentyfrom = req.body.warentyfrom;
		newinventory.warentyto = req.body.warentyto;
		newinventory.qty = 0;


		connection.query("SELECT store.idstore FROM store WHERE store.name = ?",[req.body.store], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.store = result[0].idstore;

        connection.query("SELECT category.idcategory FROM category WHERE category.name = ?",[req.body.category], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.category = result[0].idcategory;

        connection.query("SELECT generic.idgeneric FROM generic WHERE generic.name = ?",[req.body.generic], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.generic = result[0].idgeneric;

        connection.query("SELECT brand.idbrand FROM brand WHERE brand.name = ?",[req.body.brand], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.brand = result[0].idbrand;

        connection.query("SELECT make.idmake FROM make WHERE make.name = ?",[req.body.make], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.make = result[0].idmake;

        connection.query("SELECT model.idmodel FROM model WHERE model.name = ?",[req.body.model], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.model = result[0].idmodel;

        connection.query("SELECT unit.idunit FROM unit WHERE unit.name = ?",[req.body.unit], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.unit = result[0].idunit;

        connection.query("SELECT supplier.idsupplier FROM supplier WHERE supplier.name = ?",[req.body.supplier], function(err, result) {
            if (err)
             console.log(err);

        	newinventory.supplier = result[0].idsupplier;
		

			var insertQuery = "INSERT INTO inventory (inventory.itemcode,inventory.name,inventory.description,inventory.store_idstore,inventory.category_idcategory,inventory.generic_idgeneric,inventory.brand_idbrand,inventory.make_idmake,inventory.model_idmodel,inventory.unit_idunit,inventory.supplier_idsupplier,inventory.costprice,inventory.retailcash,inventory.retailcredit) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
			connection.query(insertQuery,[newinventory.serial,newinventory.name,newinventory.des,newinventory.store,newinventory.category,newinventory.generic,newinventory.brand,newinventory.make,newinventory.model,newinventory.unit,newinventory.supplier,newinventory.cost,newinventory.retailprice,newinventory.retailcredit],function(err1, newproduct) {
				if (err1)
					console.log(err1);

				newinventory.idinventory=newproduct.insertId;

				connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
                    if (err1)
                         console.log(err1);



                    connection.query("SELECT * FROM inventory WHERE idinventory = ? ",[newinventory.idinventory], function(err1, productdetails) {
                    console.log(newinventory.idinventory);

                    req.session.newproductid = newinventory.idinventory ; 

                    var insertQuery = "INSERT INTO warranty ( warranty.warrantycardno, warranty.from, warranty.to, warranty.inventory_idinventory) values (?,?,?,?)";
							connection.query(insertQuery,[newinventory.warentyno, newinventory.warentyfrom, newinventory.warentyto, newinventory.idinventory],function(error, rows) {
								if (error) 
									console.log(error);
							});

					var insertQuery = "INSERT INTO stocklevel (stocklevel.qty, stocklevel.inventory_idinventory) values (?,?)";
					connection.query(insertQuery,[newinventory.qty, newinventory.idinventory],function(errr, stockresult) {
					if (errr)
					console.log(errr);
                    res.redirect('/addproductpics');
					
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

	app.get('/addproductpics', function(req, res) {

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
                    if (err1)
                         console.log(err1);

                    connection.query("SELECT * FROM inventory WHERE idinventory = ? ",[req.session.newproductid], function(err1, productdetails) {
                    console.log(req.session.newproductid);
					res.render('addproduct2.ejs', {
						user : rows[0],	
						product : productdetails[0], //  pass to template
						level : req.user.level
					});
				});
				});

		
	});


	// =====================================
	// View stock page ======================
	// =====================================
	app.get('/viewstock', function(req, res) {
		

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

								        							var query = connection.query('SELECT * FROM inventory ORDER BY idinventory DESC',function(err10,inventorylist){
								        							if(err10)
								        							console.log(err10);

								        							res.render('viewstockpage.ejs', {
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

				});

			});

		});

	
	}

