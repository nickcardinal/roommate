
class User {
    constructor(googleAuthToken, mail) {
        this.googleAuthToken = googleAuthToken;
        this.user_ID = '';
        this.nickName = '';
        this.fName
        this.email = mail;
        this.photoUrl = '';
        //let userRef = db.collection('Users');
        //let query = userRef.where('usrEmail', '==', email).get().then(snapshot => {
        //    if (snapshot.empty) {
        //        //New user
        //    } else {
        //        snapshot.forEach(doc => {
        //            console.log(doc.id, '=>', doc.data());
        //        });
        //    }
        //}).catch(err => {
        //    console.log('Error getting documents');
        //});
    }
    pushToFirestore() {

    }
}