function initialize() {
    firebase.initializeApp(firebaseConfig);
}

function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken;
        console.log(token);
        var user = result.user;
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log("ERROR: " + errorCode + " : " + errorMessage);
    });
}

function logout() {
    firebase.auth().signOut().then(function () {

    }).catch(function (error) {

    });
}
