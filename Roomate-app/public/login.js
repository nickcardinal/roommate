function initialize() {
    firebase.initializeApp(firebaseConfig);
}
//var provider = new firebase.auth.GoogleAuthProvider();



function loginWithPopup() {
    provider = new firebase.default.auth.GoogleAuthProvider();
    firebase.auth.signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
    onSignIn(user);

}

function loginWithRedirect() {
    firebase.auth.getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a Google Access Token.
            var token = result.credential.accessToken;
        }
        var user = result.user;
    });

    //var provider = new firebase.auth.GoogleAuthProvider();
    //firebase.auth().signInWithRedirect(provider);
    //firebase.auth().getRedirectResult().then(function (result) {
    //    if (result.credential) {
    //        // This gives you a Google Access Token. You can use it to access the Google API.
    //        var token = result.credential.accessToken;
    //        // ...
    //    }
    //    // The signed-in user info.
    //    var user = result.user;
    //}).catch(function (error) {
    //    // Handle Errors here.
    //    var errorCode = error.code;
    //    var errorMessage = error.message;
    //    // The email of the user's account used.
    //    var email = error.email;
    //    // The firebase.auth.AuthCredential type that was used.
    //    var credential = error.credential;
    //    // ...
    //});
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

