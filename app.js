/*
* Jeff McGirr CS546 Final Project
* 20180803
* I pledge my honor that I have abided by the Stevens Honor System
* */

// usual setup code, plus Handlebar and Static
const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
const app = express();
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

//for testing
// const bcrypt = require("bcrypt");
// const saltRounds = 16;
// async function genhash(str){
// 	let otp =  await bcrypt.hash('test',saltRounds);
// 	console.log(otp);
// 	return
// }
// genhash('test');

app.use("/public", static);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//provided method override middleware to use hidden input to force PUT form
// app.use(methodOverride(function (req, res) {
// 	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
// 		// look in urlencoded POST bodies and delete it
// 		var method = req.body._method;
// 		delete req.body._method;
// 		return method
// 	}
// }));

app.engine("handlebars", exphbs({ defaultLayout: "layout" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:3000");
	if (process && process.send) process.send({done: true}); // ADD THIS LINE
});
