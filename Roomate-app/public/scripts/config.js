const firebaseConfig = {
    apiKey: "AIzaSyCmyzsBoBimz_LSIKGBVPqYb9-Ngq4aW38",
    authDomain: "roommate-a0823.firebaseapp.com",
    databaseURL: "https://roommate-a0823.firebaseio.com",
    projectId: "roommate-a0823",
    storageBucket: "roommate-a0823.appspot.com",
    messagingSenderId: "941174280385",
    appId: "1:941174280385:web:0ee7547beb6089b7"
};
function updateExpiration(database, doc) {
    let date = new Date();
    date.setTime(date.getTime() + 86400000);
    database.collection('Mates').doc(doc.id).update({
        usrExpiration: date
    });
}
function updateToken_Overview(database) {
    sessionStorage.removeItem('log');
    let mateRef = database.collection("Mates");
    let mateQuery = mateRef.where("usrEmail", "==", sessionStorage.getItem('email'));
    mateQuery.get().then(snapshot => {
        if (!snapshot.empty) {
            snapshot.forEach(ref => {
                sessionStorage.setItem('user', ref.id);
                let token = sessionStorage.getItem('token');
                let date = new Date();
                date.setTime(date.getTime() + 86400000);
                mateRef.doc(ref.id).update({
                    usrToken: token,
                    usrExpiration: date
                });
            });
        }
    }).catch(err => {
        console.log(
            "Error updating firestore:",
            err.code,
            err.message)
    });
}

function updateNickName_JoinOrCreate(database) {
    let nickname = sessionStorage.getItem('NickName');
    sessionStorage.removeItem('NickName');
    database
    .collection("Mates")
    .where("usrToken", "==", sessionStorage.getItem('token'))
    .get()
    .then(snapshot => {
        snapshot.forEach(ref => {
            sessionStorage.setItem('user', ref.id);
            database
            .collection("Mates")
            .doc(ref.id).update({
                usrNickname: nickname
            });
        });
    });
}
