async function login() {
  localStorage.clear();
  sessionStorage.clear();
  let token, user;
  var provider = new firebase.auth.GoogleAuthProvider();
  let db = firebase.firestore();
  let date = new Date();
  date.setTime(date.getTime() + 86400000);
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  let result = await firebase.auth().signInWithPopup(provider).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("ERROR: " + errorCode + " : " + errorMessage);
  });
  token = result.credential.accessToken;
  user = result.user;
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('email', user.email);
  sessionStorage.setItem('name', user.displayName);
  redirLogin(user, date, db);
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

function editNickName() {
  sessionStorage.setItem('NickName', document.getElementById("nickNameField").value);
  if (sessionStorage.getItem('Space')) {
    redirect ('../html/overview.html');
  }
  else {
    redirect('../html/joinOrCreateSpace.html');
  }
}

function redirect(url){
  window.location.href = url;
}
