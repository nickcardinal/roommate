var Mate = require("../public/scripts/Mate.js")

var user_ID = 'gjh43rt43tghrj';
var nickName = 'Tommy Salami';
var fullName = 'Alan Turing';
var email = 'alanturntup@oal.com';
var photoURL = 'https://google.com/images/theBestImage.png';

test('Mate Setter Test', function(){
	var mate = new Mate();
	mate.setID(user_ID);
	mate.setNickName(nickName);
	mate.setFullName(fullName);
	mate.setEmail(email);
	mate.setPhotoURL(photoURL);

	expect([mate.user_ID, mate.nickName, mate.fullName, mate.email, mate.photoURL])
	  .toEqual([user_ID, nickName, fullName, email, photoURL]);
});
//
// test('Mate Getter Test', function(){
// 	var mate = new Mate();
// 	mate.user_ID = user_ID;
// 	mate.nickName = nickName;
// 	mate.fullName = fullName;
// 	mate.email = email;
// 	mate.photoURL = photoURL;
//
// 	expect([mate.getID(), mate.getNickName(), mate.getFullName(), mate.getEmail(), mate.getPhotoURL()])
// 	  .toEqual([user_ID, nickName, fullName, email, photoURL]);
// });
