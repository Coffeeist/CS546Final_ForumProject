// jmcgirr final db
// forums/posts

const uuidv1 = require('uuid/v1');
const colls = require('../config/mongoCollections');
const cats = colls.categories;
const subs = colls.subforums;
const threads = colls.threads;
const posts = colls.posts;

// helpers
// check valid given type
function checkType(argname, arg, typestr) {
	if(typeof arg !== typestr) { throw argname + ': "' + arg + '" is not a ' + typestr; }
}
// check correct # of args
function checkNumArgs(needArgs, givenArgs) {
	if(needArgs !== givenArgs) { throw 'Incorrect number of args given - given: ' + givenArgs + ', needed: ' + needArgs; }
}



// Categories

async function getCatByID(id){
	checkNumArgs(1, arguments.length);
	if (!id) {throw "Please provide cat ID";}
	
	const cll = await cats();
	const otp = await cll.findOne({ _id: id });
	if (otp === null) {
		throw "No cat found for ID" + id;
	} else {
		return otp;
	}
}

async function addCat(name) {
	checkNumArgs(1, arguments.length);
	if (!name) {throw "Please provide cat name";}
	
	let genID = uuidv1();
	
	let newCat = {
		_id: genID,
		name: name
	};
	
	const cll = await cats();
	const inserted = await cll.insertOne(newCat);
	if (inserted.insertedCount === 0) { throw "Error, could not insert"; }
	return await getCatByID(genID);
}

async function getCats() {
	const cll = await cats();
	
	return await cll.find({}).toArray();
}

async function getCatsAndSubs(){
	let otp = [];
	let cats = await getCats();
	
	for (let cat of cats) {
		let subs = await getSubsByCatId(cat._id);
		let subsArr = [];
		
		for (let sub of subs) {
			subsArr.push({
				subId: sub._id,
				subName: sub.name,
				subPosts: sub.threads
			})
		}
		
		otp.push({
			catName: cat.name,
			subs: subsArr
		})
	}
	
	return otp;
}





// Subforums
async function addSub(name,parent) {
	checkNumArgs(2, arguments.length);
	if (!name) {throw "Please provide name;"}
	if (!parent) {throw "Please provide parent id";}
	
	let genID = uuidv1();
	
	let newSub = {
		_id: genID,
		name: name,
		parent: parent,
		threads: 0
	};
	
	const cll = await subs();
	const inserted = await cll.insertOne(newSub);
	if (inserted.insertedCount === 0) { throw "Error, could not insert"; }
	return await getSubByID(genID);
}

async function getSubByID(subId){
	checkNumArgs(1, arguments.length);
	if (!subId) {throw "Please provide sub ID";}
	
	const cll = await subs();
	const otp = await cll.findOne({ _id: subId });
	if (otp === null) {
		throw "No sub found for ID" + subId;
	} else {
		return otp;
	}
}

async function getSubsByCatId(catid) {
	checkNumArgs(1, arguments.length);
	if (!catid) {throw "Please provide cat ID";}
	
	const cll = await subs();
	
	return await cll.find({parent: catid}).toArray();
}




async function getThreadsForSub(subId){
	checkNumArgs(1, arguments.length);
	if (!subId) {throw "Please provide ID";}
	
	const cll = await threads();
	
	let subthr =  await cll.find({parent: subId}).toArray();
	// console.log(subthr);
	let otp = [];
	
	for (let thr of subthr) {
		otp.push({
			threadId: thr._id,
			threadName: thr.title,
			threadPosts: thr.posts
		})
	}
	
	return otp;
}



async function getSubName(subId){
	let subinfo = await getSubByID(subId);
	return subinfo.name;
}





// Threads/Posts

async function addThread(name,parent) {
	checkNumArgs(2, arguments.length);
	if (!name) {throw "Please provide name;"}
	if (!parent) {throw "Please provide parent id";}
	
	let genID = uuidv1();
	
	let newThr = {
		_id: genID,
		title: name,
		parent: parent,
		posts: 1
	};
	
	const cll = await threads();
	const inserted = await cll.insertOne(newThr);
	if (inserted.insertedCount === 0) { throw "Error, could not insert"; }
	return await getThreadByID(genID);
}

async function getThreadByID(thrId){
	checkNumArgs(1, arguments.length);
	if (!thrId) {throw "Please provide thread ID";}
	
	const cll = await threads();
	const otp = await cll.findOne({ _id: thrId });
	if (otp === null) {
		throw "No thread found for ID" + thrId;
	} else {
		return otp;
	}
}



async function addPost(parent,content,user) {
	checkNumArgs(3, arguments.length);
	if (!parent) {throw "Please provide parent id";}
	if (!content) {throw "Please provide content";}
	if (!user) {throw "Please provide user";}
	
	let genID = uuidv1();
	
	let newThr = {
		_id: genID,
		parent: parent,
		content: content,
		user: user,
		date: new Date()
	};
	
	const cll = await posts();
	const inserted = await cll.insertOne(newThr);
	if (inserted.insertedCount === 0) { throw "Error, could not insert"; }
	return await getPostByID(genID);
}

async function getPostByID(id){
	checkNumArgs(1, arguments.length);
	if (!id) {throw "Please provide post ID";}
	
	const cll = await posts();
	const otp = await cll.findOne({ _id: id });
	if (otp === null) {
		throw "No post found for ID" + id;
	} else {
		return otp;
	}
}

async function editPost(id, newContent) {
	checkNumArgs(2, arguments.length);
	if (!id) {throw "Please provide post ID";}
	if (!newContent) {throw "Please provide post content";}
	
	const cll = await posts();
	const updated = await cll.replaceOne ({ _id: id }, {$set: {content:newContent}});
	if (updated.modifiedCount === 0) { throw "Error updating task"; }
	
	return await getPostByID(id);
}



async function getPostsForThread(threadId) {
	checkNumArgs(1, arguments.length);
	if (!threadId) {throw "Please provide thread ID";}
	
	const cll = await posts();
	
	let thrposts =  await cll.find({parent: threadId}).sort({date:1}).toArray();
	// console.log(subthr);
	let otp = [];
	
	for (let pst of thrposts) {
		otp.push({
			postid: pst._id,
			postuser: pst.user,
			postdate: pst.date,
			postcontent: pst.content
		})
	}
	
	return otp;
}

async function deletePost(id) {
	checkNumArgs(1, arguments.length);
	if (!id) {throw "Please provide post ID";}
	
	const cll = await posts();
	const deleted = await cll.removeOne({ _id: id });
	if (deleted.deletedCount === 0) { throw "Could not find/delete recipe with ID" + id; } else { return; }
}



module.exports = {
	description: "Final Project Forums DB",
	addCat,
	getCatByID,
	getCatsAndSubs,
	getThreadsForSub,
	addSub,
	getSubName,
	getSubByID,
	getPostsForThread,
	addThread,
	getThreadByID,
	addPost,
	getPostByID,
	editPost,
	deletePost
};


//testing
let testForumDisp = [
	{
		catName:"test cat 1",
		subs: [
			{
				subId: "12313",
				subName: "test sub 1",
				subPosts: 25
			},
			{
				subId: "323131",
				subName: "test sub 2",
				subPosts: 2
			}
		]
	},
	{
		catName:"test cat 2",
		subs: [
			{
				subId: "13421",
				subName: "test sub 3",
				subPosts: 253
			},
			{
				subId: "42452",
				subName: "test sub 4",
				subPosts: 22
			}
		]
	}
];
const testThreads = [
	{
		threadId: 12345,
		threadName: "test thread 1",
		threadPosts: 5
	},
	{
		threadId: 424242,
		threadName: "test thread 2",
		threadPosts: 1
	},
	{
		threadId: 42442,
		threadName: "test thread 3",
		threadPosts: 7
	},
	{
		threadId: 4242,
		threadName: "test thread 4",
		threadPosts: 4
	}
];

const testPosts = [
	{
		postid: 12345,
		postuser: "jmcgirr",
		postdate: "08/13/2018",
		postcontent: "this is a post about something"
	},
	{
		postid: 313,
		postuser: "pb",
		postdate: "08/15/2018",
		postcontent: "this is a post about something else"
	}
];