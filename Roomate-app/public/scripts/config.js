const firebaseConfig = {
    apiKey: "AIzaSyCmyzsBoBimz_LSIKGBVPqYb9-Ngq4aW38",
    authDomain: "roommate-a0823.firebaseapp.com",
    databaseURL: "https://roommate-a0823.firebaseio.com",
    projectId: "roommate-a0823",
    storageBucket: "roommate-a0823.appspot.com",
    messagingSenderId: "941174280385",
    appId: "1:941174280385:web:0ee7547beb6089b7"
};

function validate(){
    firebase.initializeApp(firebaseConfig);
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
var mySpace;
async function initializeOverview(){
	//This function will navigate away from the bottom portion 
	//of this function if user isn't logged in or isn't part of a space.
	validate();
	
	mySpace = new Space();
	var spaceID = sessionStorage.getItem('Space');
	await mySpace.populateSpace(spaceID, populateSpaceCallback);
	if(mySpace.isLoaded){	
		var myJSON = JSON.stringify(mySpace);
		console.log(JSON.parse(myJSON));
		console.log(mySpace);
		mySpace = Object.assign(new Space, { a: 1 });//JSON.parse(myJSON);
		console.log(mySpace);
		alert('Complete');
	}
	else{
		alert('Error loading Space.');
	}
}
function populateSpaceCallback(type, value){
	if(type === 'title'){
		mySpace.setTitle(value);
	}
	else if(type === 'description'){
		mySpace.setDescription(value);
	}
	else if(type === 'mates'){
		mySpace.setMatesArray(value);
	}
	else if(type === 'tasks'){
		mySpace.setTasksArray(value);
	}
}

  function updateExpiration(database, doc){
    let date = new Date();
    date.setTime(date.getTime() + 86400000);
    database.collection('Mates').doc(doc).update({
        usrExpiration: date
    })
  }

  function updateToken_Overview(database){
    sessionStorage.removeItem('log');
        let mateRef = database.collection("Mates");
        let mateQuery = mateRef.where("usrEmail", "==", sessionStorage.getItem('email'));
        mateQuery.get().then(snapshot => {
            if (!snapshot.empty) {
              snapshot.forEach(ref => {
                sessionStorage.setItem('user', ref.id);
                let token = sessionStorage.getItem('token');
                let date = new Date();
                date.setTime(date.getTime() + 86400000);
                mateRef.doc(ref.id).update({
                    usrToken: token,
                    usrExpiration: date
                  });
              });
            }
          }).catch(err => {
            console.log(
              "Error updating firestore:",
              err.code,
              err.message
            )
          });
  }

  function updateNickName_JoinOrCreate(database){
    let nickname = sessionStorage.getItem('NickName');
    sessionStorage.removeItem('NickName');
    database
    .collection("Mates")
    .where("usrToken", "==", sessionStorage.getItem('token'))
    .get()
    .then(snapshot => {
      snapshot.forEach(ref => {
        sessionStorage.setItem('user', ref.id);
        database
        .collection("Mates")
        .doc(ref.id).update({
          usrNickname: nickname
      });
    });});

  }
