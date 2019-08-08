﻿function initialize() {
    firebase.initializeApp(firebaseConfig);
}

function login() {
    let token, user, name, email, photoUrl, verified;
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        token = result.credential.accessToken;
        user = result.user;
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        console.log(user.email)
        window.alert("Welcome, " + name);
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        //var email = error.email;
        //var credential = error.credential;
        console.log("ERROR: " + errorCode + " : " + errorMessage);
    });
    console.log(name);
}

function logout() {
    firebase.auth().signOut().then(function () {

    }).catch(function (error) {

    });
}

