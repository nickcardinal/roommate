function initialize() {
    firebase.initializeApp(firebaseConfig);
}

function validate(){
    initialize();
    database = firebase.firestore();
    if(sessionStorage.getItem('log') === 'true'){
      updateToken_Overview(database);
      return;
    }
    if(sessionStorage.getItem('NickName') !== sessionStorage.getItem('null')){
      updateNickName_JoinOrCreate(database);
      return;
    }
    let query = database.collection('Mates').where('usrToken', '==', sessionStorage.getItem('token')).get().then(snapshot =>{
        if(snapshot.empty){
            window.location.href = "../index.html";
            //console.log('Invalid Token :')
            //console.log(sessionStorage.getItem('token'));
        }else{
            snapshot.forEach(doc => {
                if(new Date() < doc.data().usrExpiration.toDate()){
                    sessionStorage.setItem('user', doc.id);
                    updateExpiration(database, doc)
                }else{
                    window.location.href = "../index.html";
                }

            });
        }
    });
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
