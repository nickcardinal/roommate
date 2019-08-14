
class Mate {
    
    constructor() {
        this.googleAuthToken;
        this.user_ID;
        this.nickName;
        this.fullName;
        this.email;
        this.photoUrl;
        //test commit
    }
    
    setToken(googleAuthToken) {
        this.googleAuthToken = googleAuthToken;
    }
    
    getToken() {
        return this.googleAuthToken;
    }
    
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
}

function createFirestoreMate() {
    var matedb = firebase.firestore();
    
    var currMate = new Mate();
    
    currMate.fullName = "John Doe";
    currMate.email = "jDoe@ucr.edu";
    currMate.photoUrl = "jDoe.com";
    
    //console.log(Andre.getFullName());
    
    matedb.collection("Mates").add(
       {
       usrNickName: $("#nameField").val(),
       usrFullName: currMate.fullName,
       usrEmail: currMate.email,
       usrPhotoURL: currMate.photoUrl,
       });
}
