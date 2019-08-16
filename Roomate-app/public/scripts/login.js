function login() {
  localStorage.clear();
  sessionStorage.clear();
  let token, user;
  var provider = new firebase.auth.GoogleAuthProvider();
  let db = firebase.firestore();
  let date = new Date();
  date.setTime(date.getTime() + 86400000);
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        token = result.credential.accessToken;
        user = result.user;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('email', user.email);
        redirLogin(user, date, db);
      });
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("ERROR: " + errorCode + " : " + errorMessage);
  });
}

function logout() {
  let db = firebase.firestore();
  db.collection("Mates")
    .where("usrToken", "==", sessionStorage.getItem('token'))
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        db.collection("Mates")
          .doc(doc.id)
          .update({
            usrToken: "",
            usrExpiration: new Date()
          });
          localStorage.clear();
          sessionStorage.clear();
      });
    }).then(ref => {
      redirect('../index.html');
    });
}

function redirLogin(user, authExpiration, database) {
  sessionStorage.setItem('log', 'true');
  firebase.firestore.setLogLevel('debug');
  let mateRef = database.collection("Mates");
  let mateQuery = mateRef.where("usrEmail", "==", user.email);
  mateQuery.get().then(snapshot => {
      if (snapshot.empty) {
        sessionStorage.setItem(2, user.displayName);
        sessionStorage.removeItem('log');
        mateRef
          .add({
            usrToken: sessionStorage.getItem('token'),
            usrExpiration: authExpiration,
            usrPhotoUrl: user.photoURL,
            usrEmail: user.email,
            usrName: user.displayName,
            usrNickname: user.displayName
          })
          .then(ref => {
            redirect('../html/profile.html');
          });
      }else{
        redirect('../html/overview.html');
      }
    });

}

function loginNewUser(redir) {
  sessionStorage.setItem('NickName', document.getElementById("nameField").value);
  sessionStorage.removeItem(2);
  redirect(redir);
}
function initializeWelcome() {
  initialize();
  document.getElementById("nameField").value = sessionStorage.getItem(2);
  database = firebase.firestore();
  let query = database
    .collection("Mates")
    .where("usrToken", "==", sessionStorage.getItem('token'));
  query
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        redirect('../index.html');
      } else {
        snapshot.forEach(doc => {
          if (new Date() < doc.data().usrExpiration.toDate()) {
            sessionStorage.setItem('user', doc.id);
          } else {
            redirect('../index.html');
          }
        });
      }
    });
}

// function displayUserInfo() {
//   //document.getElementById('FullName').innerHTML= sessionStorage.getItem('usrName');
//   document.getElementById('Email').innerHTML= sessionStorage.getItem(2);
// }

function redirect(url){
  window.location.href = url;
}
