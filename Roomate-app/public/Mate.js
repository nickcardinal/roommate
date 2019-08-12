
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
