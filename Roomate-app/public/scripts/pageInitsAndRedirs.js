// Initialization Functions
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
            redirect("../index.html");
            //console.log('Invalid Token :')
            //console.log(sessionStorage.getItem('token'));
        }else{
            snapshot.forEach(doc => {
                if(new Date() < doc.data().usrExpiration.toDate()){
                    sessionStorage.setItem('user', doc.id);
                    updateExpiration(database, doc);
                }else{
                    redirect("../index.html");
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
async function initializeOverview(){
	validate();
	if(!loadSpaceFromSessionStorage()){
		await loadSpaceFromFirestore();
		saveSpaceToSessionStorage();
		displaySpaceInfo();
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

// Redirect Page Functions
function redirect(url){
  window.location.href = url;
}

function redirectIndex() {
    redirect("..index.html");
}

function redirectProfile() {
    redirect("../html/profile.html");
}

function redirectCreateNewSpace() {
    redirect("../html/createNewSpace.html");
}

function redirectCreateTask() {
	redirect("../html/createTask.html");
}

function redirectOverview() {
    redirect("../html/overview.html");
}

function redirectSpaceKey() {
  redirect("../html/spaceKey.html");
}

function openTaskList() {
  redirect("../html/tasklist.html");
	// window.open("../html/tasklist.html");
}

function openMateList() {
  redirect("../html/mateslist.html");
  // window.open("../html/tasklist.html");
}

// Login Redirect Functions
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
        redirLoginToSpace(user, database);
      }
    });
}

function redirLoginToSpace(user, database) {
  let matedb = database.collection("Mates").where("usrEmail", "==", user.email);

  matedb
    .get()
    .then(function(snapshot){
      sessionStorage.setItem('user', snapshot.docs[0].id);
      let user = snapshot.docs[0].data();
      let spaces = user.usrSpaces;
      if(spaces != undefined) {
        let spaceID = spaces[0].id;
        sessionStorage.setItem('Space', spaceID);
        redirect('../html/overview.html')
      }else {
        redirect('../html/joinOrCreateSpace.html')
      }
    });
  }
