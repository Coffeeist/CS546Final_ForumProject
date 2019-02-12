// jmcgirr final db
// users database API file

const uuidv1 = require('uuid/v1');
const colls = require('../config/mongoCollections');
const users = colls.users;

const bcrypt = require("bcrypt");
const saltRounds = 16;

// check valid given type
function checkType(argname, arg, typestr) {
	if(typeof arg !== typestr) { throw argname + ': "' + arg + '" is not a ' + typestr; }
}
// check correct # of args
function checkNumArgs(needArgs, givenArgs) {
	if(needArgs !== givenArgs) { throw 'Incorrect number of args given - given: ' + givenArgs + ', needed: ' + needArgs; }
}




async function addUser(un,pw,em){
	checkNumArgs(3, arguments.length);
	if (!un) {throw "Please provide username";}
	if (!pw) {throw "Please provide password";}
	if (!em) {throw "Please provide email";}
	
	let genID = uuidv1();
	
	let newUser = {
		_id: genID,
		username: un,
		password: pw,
		email: em,
		joindate: new Date()
	};
	
	const usr = await users();
	const inserted = await usr.insertOne(newUser);
	if (inserted.insertedCount === 0) { throw "Error, could not insert"; }
	return await getUserById(genID);
}

async function getUserById(uid){
	checkNumArgs(1, arguments.length);
	if (!uid) {throw "Please provide user ID";}
	
	const usr = await users();
	const otp = await usr.findOne({ _id: uid });
	if (otp === null) {
		throw "No user found for ID" + uid;
	} else {
		return otp;
	}
}

async function getUserByUn(un) {
	checkNumArgs(1, arguments.length);
	if (!un) {throw "Please provide username";}
	
	const usr = await users();
	const otp = await usr.findOne({ username: un });
	if (otp === null) {
		throw "No user found for name" + un;
	} else {
		return otp;
	}
}

async function getHashPw(un) {
	checkNumArgs(1, arguments.length);
	if (!un) {throw "Please provide username";}
	
	let userdata = await getUserByUn(un);
	if (userdata.password === null) {
		throw "No user found for name" + un;
	} else {
		return userdata.password;
	}
}

async function checkPw(un,inpw){
	checkNumArgs(2, arguments.length);
	if (!un) {throw "Please provide username";}
	if (!inpw) {throw "Please provide pw";}
	
	let hashpw = await getHashPw(un);
	
	// let testusr = await getUserByUn(un);
	// console.log(testusr);
	// console.log(inpw);
	// console.log(hashpw);
	
	return await bcrypt.compare(inpw, hashpw);
}



module.exports = {
	description: "Final Project User DB",
	getUserById,
	getUserByUn,
	getHashPw,
	checkPw,
	addUser
};