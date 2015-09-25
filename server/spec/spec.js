var mysql = require('mysql');
var request = require('request');
var chai = require('chai');
var expect = chai.expect;

describe('Should have data persistence', function() {
	var db;
	
	beforeEach(function(done) {
		db = mysql.createConnection({
			user:"root",
			password:"",
			database:"greenfeels"
		});
		db.connect();

		// db.query('set foreign_key_checks =0;',done);
		// db.query('truncate table users;',done);
		// db.query('set foreign_key_checks =1;',done);
	
	});


	afterEach(function(done){
		db.end();
	});

	it("should save a user and password into the database", function(done){

		request({
			method: "POST",
			uri: "http://localhost:8080/api/users",
			json: { username: "John" , password: "1234"}
		}, function (){
			var queryString = "SELECT username from users WHERE username='John' AND password='1234'";
			db.query(queryString, [], function(err, results) {
				if (err) {
					console.log(err);
				}
				expect(results.length).to.equal(1);
				expect(results).to.equal("John");
				done();
				});
			});
		});

	it("should retrieve a user and password on get request", function(done){
		request({
			method: "GET",
			uri: "http://localhost:8080/api/users",
		}, function(err, response, body) {
			if (err) {
				console.log(err);
			}
			expect(body.length).to.equal(1);
			expect(body.username).to.equal("John");
			expect(body.password).to.equal("1234");
			done();			
		})
	});

	// it ("should save feels and feel scale",function(done){
		
	// })
	// it("should retrieve feels",function(done){

	// });
	// it ("shouls save prompts",function(done){

	// });
	// it("should retrieve prompts",function(done){

	// });

});
