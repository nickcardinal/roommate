var Mate = require("../public/scripts/Mate.js")

test('Getter/Setter Test', function(){
	var user_ID = 'gjh43rt43tghrj';
	var nickName = 'Tommy Salami';
	var fullName = 'Alan Turing';
	var email = 'alanturntup@oal.com';
	var photoURL = 'https://google.com/images/theBestImage.png';

	var mate = new Mate();
	mate.setID(user_ID);
	mate.setNickName(nickName);
	mate.setFullName(fullName);
	mate.setEmail(email);
	mate.setPhotoURL(photoURL);

	expect([mate.getID(), mate.getNickName(), mate.getFullName(), mate.getEmail(), mate.getPhotoURL()])
											  .toEqual([user_ID, nickName, fullName, email, photoURL]);
});
