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
    window.location.href = './index.html';
  }
  
  function redirLogin(user, database){
    let mateRef = database.collection("Mates");
    sessionStorage.setItem(0, user.email);
    let mate = mateRef
      .where("usrEmail", "==", user.email)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          sessionStorage.setItem(1, user.displayName);
          window.location.href = './welcome.html';
          return;
        }
        window.location.href = './overview.html';
      }).catch(err => {
          console.log('Error getting documents', err);
      });
  }

  function loginNewUser(redir){
    sessionStorage.removeItem(1);
    let database = firebase.firestore();
    database.collection("Mates").add({
        usrName: document.getElementById("userName").value,
        usrNickname:  document.getElementById("nickname").value,
        usrEmail: sessionStorage.getItem(0)
    }).then(ref =>{
        window.location.href = redir;
    });
  }
  function initializeWelcome(){
      if(!sessionStorage.getItem(0).includes('@')){
          window.location.href = "./index.html";
      }
      initialize();
      database = firebase.firestore();
      let query = database.collection('Mates').where('usrEmail', '==', sessionStorage.getItem(0)).get().then(snapshot =>{
          if(!snapshot.empty){
              window.location.href = "./index.html";
          }else{
              return;
          }
      });
      document.getElementById("userName").value = sessionStorage.getItem(1);
      document.getElementById("nickname").value = sessionStorage.getItem(1);
  }

 