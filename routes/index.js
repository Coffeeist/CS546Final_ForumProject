/*
* Jeff McGirr CS546 Final Project
* 20180803
* I pledge my honor that I have abided by the Stevens Honor System
* */

// adapted from lecture code
const mainRte = require("./main");

const constructorMethod = app => {
	app.use("/", mainRte);
	
	app.use("*", (req, res) => {
		res.status(404).json({ error: "Error 404: Not found" });
	});
};

module.exports = constructorMethod;
