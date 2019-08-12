function login() {
    localStorage.clear();
    sessionStorage.clear();
    let token, user, name, email;
    var provider = new firebase.auth.GoogleAuthProvider();
    let db = firebase.firestore();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        token = result.credential.accessToken;
        localStorage.setItem(0, token);
        user = result.user;
        name = user.displayName;
        email = user.email;
        redirLogin(user, db);
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("ERROR: " + errorCode + " : " + errorMessage);
      });
  }
  
  function logout() {
    localStorage.clear();
    sessionStorage.clear();
    firebase.auth().signOut().then(function() {
  
    }).catch(function(error) {
  
    });
  }
  
  function redirLogin(user, database){
    let mateRef = database.collection("Mates");
    let mate = mateRef
      .where("usrEmail", "==", user.email)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          let nickname = window.prompt("Welcome, " + user.displayName + ', enter a nickname: ',user.displayName);
          if (nickname == null || nickname == "") {
            nickname = user.displayName;
          }
          sessionStorage.setItem(0, user.displayName);
          sessionStorage.setItem(1, nickname);
          sessionStorage.setItem(2, user.email);
          window.location.href = './joinOrCreate.html';
          return;
        }
        snapshot.forEach(doc => {
          console.log(doc.id + " " + doc.data());
        });
        window.location.href = './overview.html';
      }).catch(err => {
          console.log('Error getting documents', err);
      });
  }