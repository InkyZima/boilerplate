var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var fs = require("fs");
var sqlite = require("sqlite3");
// var $ = jQuery = require('jquery');
var XLSX = require('xlsx');
// var inky = require("./inkyzima");
const c = console.log;
const ct = console.trace;



const c = console.log;
var db = new sqlite.Database("main.db");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("static"));
app.listen(80, () => console.log("server running"));





// *** middleware

// (cookieless) auth on ajax (ajax sends user and pass)
function auth (req,res,next) {
	if (req.body.user && req.body.pass) {
		var user = req.body.user;
		var pass = req.body.pass;
		db.get("SELECT user,password FROM users WHERE user=?" , user , (err, sqlres) => {
			if (err) {c("sql request for auth failed."); res.send("sql request for auth failed.");}
			else {
				c(sqlres);
				if (sqlres.password === pass) next();
				else {
					c("user/pw pair not in db or mismatch. user: " + sqlres.user);
					res.send("user/pw pair not in db or mismatch. user: " + sqlres.user);
				}
			}
		});
	} else res.send("user or pass empty.");
	// res.send(req.body);
}