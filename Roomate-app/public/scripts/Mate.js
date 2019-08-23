class Mate {

    constructor() {
        //this.googleAuthToken;
        this.user_ID;
        this.nickName;
        this.fullName;
        this.email;
        this.photoURL;
    }

//    setToken(googleAuthToken) {
//        this.googleAuthToken = googleAuthToken;
//    }
//
//    getToken() {
//        return this.googleAuthToken;
//    }

    setID(user_ID) {
        this.user_ID = user_ID;
    }

    getID() {
        return this.user_ID;
    }

    setNickName(nickName) {
        this.nickName = nickName;
    }

    getNickName() {
        return this.nickName;
    }

    setFullName(fullName) {
        this.fullName = fullName;
    }

    getFullName() {
        return this.fullName;
    }

    setEmail(email) {
        this.email = email;
    }

    getEmail() {
        return this.email;
    }

    setPhotoURL(photoURL) {
        this.photoURL = photoURL;
    }

    getPhotoURL() {
        return this.photoURL;
    }

    pullMate(user_ID, database){
        this.setID(user_ID);
        let mate = database.collection('Mates').doc(this.user_ID);
        this.email = mate.data().usrEmail;
        this.nickName = mate.data().usrNickName;
        this.fullName = mate.data().usrName;
        this.photoURL = mate.data().usrPhotoUrl;
    }

	outputMateProperties(){
		console.log('email: ', this.email);
		console.log('nickname: ', this.nickName);
		console.log('fullName: ', this.fullName);
		console.log('photoURL: ', this.photoURL);
	}

}

function addNewMate() {
    var matedb = firebase.firestore();

    var mate = matedb.collection('Mates').doc(sessionStorage.getItem(1));
    mate.update({
        userNickname: document.getElementById($("#nameField").val()),
    })
    //usrNickName: $("#nameField").val(),
}

function assignMateInfo(docId, db) {
    let mate = db.collection('Mates').doc(docId);

    this.user_ID = docId;
    this.fullName = mate.data().usrName;
    this.nickName = mate.data().usrNickName;
    this.email = mate.data().usrEmail;
    this.photoURL = mate.data().usrPhotoUrl;
}

try{
	module.exports = Mate;
}catch(e){
	
}