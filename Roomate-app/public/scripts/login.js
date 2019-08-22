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

  mateQuery
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        sessionStorage.setItem('name', user.displayName);
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
      } else {

        sessionStorage.setItem('user', snapshot.docs[0].id);
        let user = snapshot.docs[0].data();

        //redirect if no nickname
        let nickname = user.usrNickName;
        if(nickname == undefined) {
          redirect('../html/profile.html');
        }

        //redirect if no space
        let spaces = user.usrSpaces;
        redirLoginToSpace(user, database);
        if(spaces != undefined) {
          let spaceID = spaces[0].id;
          sessionStorage.setItem('Space', spaceID);
          redirect('../html/overview.html')
        }else {
          redirect('../html/joinOrCreateSpace.html')
        }
      }
    });
}
function loginNewUser(redir) {
  sessionStorage.setItem('NickName', document.getElementById("nameField").value);
  redirect(redir);
}
function displayUserInfo() {
  document.getElementById('FullName').innerHTML= sessionStorage.getItem('name');
  document.getElementById('Email').innerHTML= sessionStorage.getItem('email');
  document.getElementById('nameField').innerHTML = sessionStorage.getItem('nickname');
}

function redirect(url){
  window.location.href = url;
}
