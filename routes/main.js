/*
* Jeff McGirr CS546 Final Project
* 20180803
* I pledge my honor that I have abided by the Stevens Honor System
* */

const express = require("express");
const router = express.Router();
const userdata = require("../data/users");
const postsdata = require("../data/posts");

const bcrypt = require("bcrypt");
const saltRounds = 16;

// display the main page
router.get('/',function(req,res){
	if (req.cookies.AuthCookie) {
		res.redirect('/main');
	} else {
		try {
			res.redirect("/login");
		} catch (e) {
			res.status(500).json({ message: "Error occurred redirecting to login page" });
		}
	}
});

// display the login page
router.get('/login',function(req,res){
	try {
		res.render("pages/login",{title:"Login",showMsg:false,msg:""});
	} catch (e) {
		res.status(500).json({ message: "Error occurred rendering login page" });
	}
});

// display the reg page
router.get('/signup',async function(req,res){
	try {
		res.render("pages/signup",{title:"Register",});
	} catch (e) {
		res.status(500).json({ message: "Error occurred rendering signup page" });
	}
});

// display the add thread page
router.get('/addthread/:subid',async function(req,res){
	let subId = req.params.subid;
	try {
		res.render("pages/addpost",{title:"New Thread",showMsg:false, msg:"", update:false,newThread:true,threadTitle:"",lockTitle:false,content:"",threadId:"",subId:subId});
	} catch (e) {
		res.status(500).json({ message: "Error occurred rendering add post page" });
	}
});
router.post('/addthread/:id',async function(req,res){
	let subId = req.params.id;
	let newtitle = req.body['title'];
	let newcon = req.body['content'];
	let user = req.cookies.AuthCookie;
	try {
		let newthr = await postsdata.addThread(newtitle,subId);
		await postsdata.addPost(newthr._id,newcon,user);
		res.redirect('/thread/'+newthr._id);
	} catch (e) {
		res.status(500).json({ message: "Error occurred updating post" });
	}
});


// display the add posts page
router.get('/addpost/:threadid',async function(req,res){
	let updId = req.params.threadid;
	let threadinfo = await postsdata.getThreadByID(updId);
	try {
		res.render("pages/addpost",{title:"New Post",showMsg:false, msg:"", update:false,newThread:false,threadTitle:threadinfo.title,lockTitle:true,content:"",threadId:updId});
	} catch (e) {
		res.status(500).json({ message: "Error occurred rendering add post page" });
	}
});
router.post('/addpost/:id',async function(req,res){
	let threadId = req.params.id;
	let newcon = req.body['content'];
	let user = req.cookies.AuthCookie;
	try {
		await postsdata.addPost(threadId,newcon,user);
		res.redirect('/thread/'+threadId);
	} catch (e) {
		res.status(500).json({ message: "Error occurred updating post" });
	}
});


// display the update posts page
router.get('/updatepost/:id',async function(req,res){
	let updId = req.params.id;
	let currPost = await postsdata.getPostByID(updId);
	let parentInfo = await postsdata.getThreadByID(currPost.parent);
	try {
		res.render("pages/addpost",{title:"Update Post",showMsg:false, msg:"", update:true,newThread:false,threadTitle:parentInfo.title,lockTitle:true,content:currPost.content,threadId:currPost.parent,postId:updId});
	} catch (e) {
		res.status(500).json({ message: "Error occurred rendering add post page" });
	}
});

// update PUT
router.post('/updatepost/:id',async function(req,res){
	let updId = req.params.id;
	let newcon = req.body['content'];
	let originthread = req.body['threadId'];
	try {
		await postsdata.editPost(updId,newcon);
		res.redirect('/thread/'+originthread);
	} catch (e) {
		res.status(500).json({ message: "Error occurred updating post" });
	}
});


router.post('/login', async function(req,res){
	let givenUn = req.body['username'];
	let givenPw = req.body['password'];
	
	let checkPw = await userdata.checkPw(givenUn,givenPw);
	// console.log(req.username);
	// console.log(checkPw);
	
	if (checkPw) {
		// not the most secure thing...
		res.cookie("AuthCookie", givenUn);
		// res.username = req.username;
		res.redirect('/main');
	} else {
		try {
			res.render("pages/login",{title:"Login",showMsg:true,msg:"Invalid Username or Password, please try again"});
		} catch (e) {
			res.status(500).json({ message: "Error occurred rendering login page" });
		}
	}
});

router.post('/register', async function(req,res){
	if (!req.body) {
		res.status(400).json({error: "Error 400 - need user data"});
		return;
	}
	if ((!req.body.username) || (!req.body.password) || (!req.body.email)) {
		res.status(400).json({error: "Error 400 - need user data"});
		return;
	}
	
	try {
		let hashpw = await bcrypt.hash(req.body.password,saltRounds);
		await userdata.addUser(req.body.username, hashpw, req.body.email);
		try {
			res.render("pages/login",{title:"Login",showMsg:true,msg:"Account Created, try logging in!"});
		} catch (e) {
			res.status(500).json({ message: "Error occurred rendering login page" });
		}
	} catch (e) {
		res.status(500).json({ error: e + " error from adduser" });
	}
});

router.get('/main',async function(req,res){
	if (req.cookies.AuthCookie) {
		let mainDisp = await postsdata.getCatsAndSubs();
		// console.log(mainDisp);
		try {
			res.render("pages/main",{title:"The Forum",cats:mainDisp});
		} catch (e) {
			res.status(500).json({ message: "Error occurred rendering main page" });
		}
	} else {
		try {
			res.redirect("/login");
		} catch (e) {
			res.status(500).json({ message: "Error occurred redirecting to login page" });
		}
	}
});

router.get('/sub/:id',async function(req,res){
	let getId = req.params.id;
	try {
		let dispThreads = await postsdata.getThreadsForSub(getId);
		// console.log(dispThreads);
		let subname = await postsdata.getSubName(getId);
		res.render("pages/sub",{title:"Subforum - " + subname,threads:dispThreads,subId:getId});
	} catch (e) {
		res.status(404).json({ message: "Couldn't locate subforum with ID: " + getId });
	}
});

router.get('/thread/:id',async function(req,res){
	let getId = req.params.id;
	try {
		let dispThreads = await postsdata.getPostsForThread(getId);
		res.render("pages/thread",{title:"Read Post",posts:dispThreads,threadId:getId});
	} catch (e) {
		res.status(404).json({ message: "Couldn't locate thread with ID: " + getId });
	}
});

router.get('/deletepost/:postid',async function(req,res){
	let delId = req.params.postid;
	try {
		await postsdata.deletePost(delId);
		res.redirect('back');
	} catch (e) {
		res.status(404).json({ message: "Couldn't delete post with ID: " + delId });
	}
});

router.get('/logout',function(req,res){
	if (req.cookies.AuthCookie) {
		// from lecture code
		const anHourAgo = new Date();
		anHourAgo.setHours(anHourAgo.getHours() - 1);
		// setting the value as invalid just as a 'note' of its invalidity
		res.cookie("AuthCookie", "invalid", { expires: anHourAgo });
		res.clearCookie("AuthCookie")
	}
	// res.redirect('/');
	try {
		res.render("pages/login",{title:"Login",showMsg:true,msg:"Logged Out"});
	} catch (e) {
		res.status(500).json({ message: "Error occurred rendering login page" });
	}
});

module.exports = router;