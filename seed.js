// provided seed code adapted

const dbConnection = require("./config/mongoConnection");
const userdata = require("./data/users");
const postsdata = require("./data/posts");

const user1 = {
	username: 'test',
	password: '$2b$16$nXRAoSz6hHejIe0vQxB.o.UI5CxPkGQNtmgr91AuBqnWWptnyQFTS',
	email: 'test@test.co' };

const user2 = {
	username: 'jmcgirr',
	password: '$2b$16$bAyvX6ckGFwR8blq2SLGQ.1oDt6Z5NPcnvmQsQu7GYgHKMqD5/W6G',
	email: 'test@test.co' };



async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  
 	await userdata.addUser(user1.username,user1.password,user1.email);
	await userdata.addUser(user2.username,user2.password,user2.email);
	
	let cat1 = await postsdata.addCat('Colleges');
	let cat2 = await postsdata.addCat('Smartphones');
	let cat3 = await postsdata.addCat('Laptops');
	
	let sub1_1 = await postsdata.addSub("Stevens",cat1._id);
	let sub1_2 = await postsdata.addSub("UMass Lowell",cat1._id);
	let sub2_1 = await postsdata.addSub("LG V35",cat2._id);
	let sub2_2 = await postsdata.addSub("Galaxy Note 9",cat2._id);
	let sub3_1 = await postsdata.addSub("Surface Book 2",cat3._id);
	
	let thr1 = await postsdata.addThread("Best Classes?",sub1_1._id);
	await postsdata.addPost(thr1._id,"What are they?","test");
	await postsdata.addPost(thr1._id,"CS546","jmcgirr");
	
	let thr2 = await postsdata.addThread("Best Classes here?",sub1_2._id);
	await postsdata.addPost(thr2._id,"I wouldn't know...","jmcgirr");
	
	let thr3 = await postsdata.addThread("How to use Dbrand Skin",sub2_1._id);
	await postsdata.addPost(thr3._id,"Just buy the V30 one and cut a bit under the camera and flash modules.","jmcgirr");
	
	let thr3b = await postsdata.addThread("How to use ATT Voicemail on Amazon model",sub2_1._id);
	await postsdata.addPost(thr3b._id,"Download and install the APK manually from apkmirror or some such,","jmcgirr");
	
	let thr4 = await postsdata.addThread("Size versus Note 8?",sub2_2._id);
	await postsdata.addPost(thr4._id,"Looking to upgrade and am curious...","test");
	
	let thr5 = await postsdata.addThread("Hinge reliability",sub3_1._id);
	await postsdata.addPost(thr5._id,"Really want to buy one, need to know.","jmcgirr");
	await postsdata.addPost(thr5._id,"Solid!","test");
	

  console.log("Done seeding database");
	await db.serverConfig.close();
}

main();
