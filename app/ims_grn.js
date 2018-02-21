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

								        							if(grnorderlist.length){

								        							var query = connection.query('SELECT * FROM inventory',function(err10,inventorylist){
								        							if(err10)
								        							console.log(err10);

								        								var query = connection.query('SELECT * FROM grnproducts WHERE grnorder_idgrnorder = ?',[grnorderlist[0].grnorder_idgrnorder],function(err11,grnproducts){
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

		var insertQuery = "INSERT INTO grnproducts ( grnproducts.grnorder_idgrnorder, grnproducts.inventory_idinventory, grnproducts.qty, grnproducts.unitcost, grnproducts.productserial) values (?,?,?,?,?)";
		connection.query(insertQuery,[req.body.order, inv[0].idinventory, req.body.qty, inv[0].costprice, inv[0].itemcode ],function(err2, rows) {
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
			newgrn.to = req.body.to;
			newgrn.tel = req.body.tel;

			var insertQuery = "INSERT INTO grn ( grn.to, grn.grnorder_idgrnorder, grn.total, grn.date, grn.emp ) values (?,?,?,?,?)";
			connection.query(insertQuery,[newgrn.to, newgrn.order, newgrn.total, newgrn.date, newgrn.emp],function(err, rows) {
			if (err)
				console.log(err);

				connection.query('UPDATE grnorder SET status = ? WHERE idgrnorder = ?',['B', newgrn.order], function(err, result) {
				if (err) 
					console.log(err);
				
				res.redirect('/home');

				});
		});
	});




		




	
	}

