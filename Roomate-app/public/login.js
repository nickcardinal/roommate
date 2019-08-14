function login() {
  localStorage.clear();
  sessionStorage.clear();
  let token, user;
  var provider = new firebase.auth.GoogleAuthProvider();
  let db = firebase.firestore();
  let date = new Date();
  date.setTime(date.getTime() + 86400000);
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      token = result.credential.accessToken;
      user = result.user;
      sessionStorage.setItem(0, token);
      sessionStorage.setItem(1, user.email);
      redirLogin(user, date, db);
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("ERROR: " + errorCode + " : " + errorMessage);
    });
}

function logout() {
  let db = firebase.firestore();
  db.collection("Mates")
    .where("usrToken", "==", sessionStorage.getItem(0))
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        db.collection("Mates")
          .doc(doc.id)
          .update({
            usrToken: "",
            usrExpiration: new Date()
          });
      });
    });
    localStorage.clear();
  sessionStorage.clear();
  window.location.href = './index.html';
}

function redirLogin(user, authExpiration, database) {
  let mateRef = database.collection("Mates");
  let mate = mateRef
    .where("usrEmail", "==", user.email)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        sessionStorage.setItem(2, user.displayName);
        mateRef
          .add({
            usrToken: sessionStorage.getItem(0),
            usrExpiration: authExpiration,
            usrPhotoUrl: user.photoURL,
            usrEmail: user.email,
            usrName: user.displayName,
            usrNickname: user.displayName
          })
          .then(ref => {
            window.location.href = "./welcome.html";
          });
      }
      snapshot.forEach(ref => {
        //   console.log(ref.id);
        //   console.log(sessionStorage.getItem(0));
        sessionStorage.setItem(1, ref.id);
        let token = sessionStorage.getItem(0);
        mateRef.doc(ref.id).update({
            usrToken: token,
            usrExpiration: authExpiration
        })
        .then(ref => {
            window.location.href = './overview.html';
        });
      });
    });
}

function loginNewUser(redir) {
  sessionStorage.removeItem(2);
  let database = firebase.firestore();
  console.log(sessionStorage.getItem(0));
  database
    .collection("Mates")
    .where("usrToken", "==", sessionStorage.getItem(0))
    .get()
    .then(snapshot => {
      snapshot.forEach(ref => {
        database
        .collection("Mates")
        .doc(ref.id).set({
          usrName: document.getElementById("userName").value,
          usrNickname: document.getElementById("nickname").value,
      }, {merge:true});
      sessionStorage.setItem(1, ref.id);
    });
  
    })
    .then(ref => {
      sessionStorage.removeItem(3);
    })
    .then(ref => {
      window.location.href = redir;
    });
}
function initializeWelcome() {
  initialize();
  database = firebase.firestore();
  let query = database
    .collection("Mates")
    .where("usrToken", "==", sessionStorage.getItem(0));
  query
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        window.location.href = "./index.html";
      } else {
        snapshot.forEach(doc => {
          if (new Date() < doc.data().usrExpiration.toDate()) {
            sessionStorage.setItem(4, doc.id);
          } else {
            window.location.href = "./index.html";
          }
        });
      }
    })
    .then(ref => {
      document.getElementById("userName").value = sessionStorage.getItem(2);
      document.getElementById("nickname").value = sessionStorage.getItem(2);
    });
}
