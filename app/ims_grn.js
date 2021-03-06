// app/ims.js
	
	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	var cookieParser = require('cookie-parser');
	const fileUpload = require('express-fileupload');
	var math = require('mathjs');
		
	connection.query('USE ' + dbconfig.database);


	module.exports = function(app, passport) {

	// =====================================
	// Add categories ======================
	// =====================================
	app.get('/newgrn', function(req, res) {
		

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

								        						var query = connection.query('SELECT * FROM grnorder WHERE employee_idemployee = ?',[rows[0].idemployee],function(err9,grnorderlist){
								        						if(err9)
								        							console.log(err9);

								        							console.log(grnorderlist);

								        							if(grnorderlist.length){

								        							var query = connection.query('SELECT * FROM inventory',function(err10,inventorylist){
								        							if(err10)
								        								console.log(err10);

								        								var query = connection.query('SELECT * FROM grnproducts WHERE grnorder_idgrnorder = ?',[grnorderlist[0].idgrnorder],function(err11,grnproducts){
								        								if(err11)
								        								console.log(err11);

								        								res.render('newgrn.ejs', {
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
																		grncont : grnorderlist[0],
																		products : grnproducts,
																		level : req.user.level

																		});


								        					});

								        				});

								        				}else{

								        				var newgrn = new Object();
														newgrn.empid = rows[0].idemployee;

														var insertQuery = "INSERT INTO grnorder (grnorder.employee_idemployee) values (?)";
														connection.query(insertQuery,[ newgrn.empid ],function(err, newrow) {
														if (err)
															console.log(err);

														res.redirect('/newgrn'); 

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


	// =====================================
	// =====================================
	// add qtys to list

	app.post('/listupqty', function(req, res) {

		connection.query("SELECT * FROM inventory WHERE inventory.name = ?",[req.body.product], function(err1, inv) {
		if (err1)
			console.log(err1);

		var insertQuery = "INSERT INTO grnproducts ( grnproducts.grnorder_idgrnorder, grnproducts.inventory_idinventory, grnproducts.qty, grnproducts.unitcost) values (?,?,?,?)";
		connection.query(insertQuery,[req.body.order, inv[0].idinventory, req.body.qty, inv[0].costprice],function(err2, rows) {
		if (err2)
			console.log(err2);

		console.log("add to list");
		res.redirect('/newgrn');
			});

		});
		});

	// =====================================
	// =====================================
	// add qtys to list

	app.post('/delfromlist', function(req, res) {

		connection.query("DELETE FROM grnproducts WHERE idgrnproducts = ?",[req.body.delitem], function(err, rows) {
			if (err)
			 console.log(err);

			console.log("delete from list");
			res.redirect('/newgrn'); 
						                    
			});

		});


	// =====================================
	// =====================================
	// Saving order to GRN

	app.post('/savegrn', function(req, res) {

			var newgrn = new Object();
			newgrn.date = req.body.datetime;
			newgrn.emp = req.body.emp;
			newgrn.order = req.body.order;
			newgrn.total = req.body.total;
			newgrn.to = req.body.supplier;

			console.log(newgrn.date);
			console.log(newgrn.emp);
			console.log(newgrn.order);
			console.log(newgrn.total);
			console.log(newgrn.to);


			connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
            	console.log(err1);

            connection.query("SELECT * FROM grnorder WHERE employee_idemployee = ? ",[rows[0].idemployee],function(err2,grnlist){
			  if(err2)
				console.log(err2);

				connection.query("SELECT * FROM grnproducts WHERE grnorder_idgrnorder = ? ",[grnlist[0].idgrnorder],function(err3,grnprolist){
			  	if(err3)
					console.log(err3);

					var insertQuery = "INSERT INTO grn (grn.employee_idemployee , grn.date, grn.supplier, grn.total) values (?,?,?,?)";
					connection.query(insertQuery,[ newgrn.emp, newgrn.date, newgrn.to, newgrn.total ],function(err, newgrnrow) {
					if (err)
						console.log(err);

					if(grnprolist.length){
					for(var i = 0;i < grnprolist.length;i++) { 

						var togrn = new Object();
						togrn.grn_idigrn = newgrnrow.insertId;
						togrn.inventory_idinventory = grnprolist[i].inventory_idinventory;
						togrn.qty = grnprolist[i].qty;
						togrn.unit = grnprolist[i].unitcost;

						var insertQuery = "INSERT INTO productforgrn (productforgrn.grn_idgrn, productforgrn.inventory_idinventory,productforgrn.qty,productforgrn.unitcost) values (?,?,?,?)";
						connection.query(insertQuery,[ togrn.grn_idigrn, togrn.inventory_idinventory, togrn.qty, togrn.unit],function(err, newprorow) {
						if (err)
							console.log(err);

							});

						}
					}

					if(grnprolist.length){
					for(var i = 0;i < grnprolist.length;i++) {
						connection.query("DELETE FROM grnproducts WHERE idgrnproducts = ?",[grnprolist[i].idgrnproducts], function(err, rows) {
						console.log("deleted.........");
						});

						}

						var insertQuery1 = "UPDATE grnorder SET grnorder.total = ? WHERE grnorder.idgrnorder = ?";
						connection.query(insertQuery1,[ 0, grnlist[0].idgrn],function(err, rows) {
						 if (err) 
							console.log(err);

						 console.log("Total is 0");
							});
						}


						res.redirect('/newgrn');

					
					    });
				    });	
				});
			});

		});

	// ========================
	// load All GRN ======
	// ========================

	app.get('/viewgrn', function(req, res) {

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
              	console.log(err1);

            connection.query("SELECT * FROM employee", function(err1, emplist) {
            if (err1)
              	console.log(err1);

			var query = connection.query("SELECT * FROM grn ORDER BY idgrn DESC",function(err2,grnlist){
				if(err2)
					console.log(err2);

					if(grnlist.length){
					res.render('viewgrn.ejs', {
					user : rows[0],		//  pass to template
					grn : grnlist,
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
	// Print Grn ======
	// ===========================

	app.post('/printgrn', function(req, res) {

		console.log(req.body.grnid);

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
              	console.log(err1);
              connection.query("SELECT * FROM employee ", function(err1, emplist) {
	            if (err1)
	              	console.log(err1);

				var query = connection.query("SELECT * FROM grn WHERE grn.idgrn = ? ",[req.body.grnid],function(err2,grnlist){
				if(err2)
					console.log(err2);

				var query = connection.query("SELECT * FROM productforgrn WHERE productforgrn.grn_idgrn = ? ",[req.body.grnid],function(err2,grnprolist){
				if(err2)
					console.log(err2);

					var query = connection.query("SELECT * FROM inventory ",function(err2,inventory){
					if(err2)
						console.log(err2);

					if(grnlist.length){
					res.render('grn_print.ejs', {
					user : rows[0],		//  pass to template
					grn : grnlist[0],
					grnpro: grnprolist,
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
	// View Grn ============
	// ===========================

	app.post('/viewgrns', function(req, res) {

		console.log(req.body.grnid);

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
              	console.log(err1);
              connection.query("SELECT * FROM employee ", function(err1, emplist) {
	            if (err1)
	              	console.log(err1);

				var query = connection.query("SELECT * FROM grn WHERE grn.idgrn = ? ",[req.body.grnid],function(err2,grnlist){
				if(err2)
					console.log(err2);

				var query = connection.query("SELECT * FROM productforgrn WHERE productforgrn.grn_idgrn = ? ",[req.body.grnid],function(err2,grnprolist){
				if(err2)
					console.log(err2);

					var query = connection.query("SELECT * FROM inventory ",function(err2,inventory){
					if(err2)
						console.log(err2);


					if(grnlist.length){
					res.render('viewgrns.ejs', {
					user : rows[0],		//  pass to template
					grn : grnlist[0],
					grnpro: grnprolist,
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

	// ========================
	// load All pending GRN  ======
	// ========================

	app.get('/viewpendinggrn', function(req, res) {

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
              	console.log(err1);

            connection.query("SELECT * FROM employee", function(err1, emplist) {
            if (err1)
              	console.log(err1);

			var query = connection.query("SELECT * FROM grn WHERE grn.status = 'A' ORDER BY idgrn DESC",function(err2,grnlist){
				if(err2)
					console.log(err2);

					if(grnlist.length){
					res.render('viewgrnpending.ejs', {
					user : rows[0],		//  pass to template
					grn : grnlist,
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

	// =======================
	// GRN Add to stock ======
	// =======================

	app.post('/addstock', function(req, res) {

		console.log(req.body.grnid);

		connection.query("SELECT * FROM employee WHERE login_idlogin = ? ",[req.user.idlogin], function(err1, rows) {
            if (err1)
              	console.log(err1);
              connection.query("SELECT * FROM employee ", function(err1, emplist) {
	            if (err1)
	              	console.log(err1);

				var query = connection.query("SELECT * FROM grn WHERE grn.idgrn = ? ",[req.body.grnid],function(err2,grnlist){
				if(err2)
					console.log(err2);

				var query = connection.query("SELECT * FROM productforgrn WHERE productforgrn.grn_idgrn = ? ",[req.body.grnid],function(err2,grnprolist){
				if(err2)
					console.log(err2);

					var query = connection.query("SELECT * FROM inventory ",function(err2,inventory){
					if(err2)
						console.log(err2);
					var query = connection.query("SELECT * FROM stocklevel",function(err2,stock){
					if(err2)
						console.log(err2);


					if(grnlist.length){

						if(grnprolist.length){

						var errqty=" ";

						for(var j = 0;j < grnprolist.length;j++) {
							var inventoryid = grnprolist[j].inventory_idinventory;
							var addqty = grnprolist[j].qty;
							var newqty = 0;
								for(var l = 0;l < stock.length;l++) {
								if(stock[l].inventory_idinventory == inventoryid){
								 newqty = math.add(stock[l].qty , addqty);
									}
								}
							
							var insertQuery1 = "UPDATE stocklevel SET stocklevel.qty = ? WHERE inventory_idinventory = ?";
							connection.query(insertQuery1,[ newqty, inventoryid],function(errqty1, done) {
							if (errqty1) 
								console.log(errqty1);
								errqty="error";
							});

							console.log(grnprolist[j].inventory_idinventory+" qty updated");

							}

							if (errqty=="error"){
								console.log(errqty);
							}else{
								var insertQuery1 = "UPDATE grn SET grn.status = 'B' WHERE grn.idgrn = ?";
								connection.query(insertQuery1,[req.body.grnid],function(err1, done) {
								if (err1) 
									console.log(err1);

								});
							}
							res.redirect('/viewpendinggrn');
						}

					}else{
						res.redirect('/viewpendinggrn');
					}

					});

					});

					});

				});

			});
			
		});

	});


	
	}

