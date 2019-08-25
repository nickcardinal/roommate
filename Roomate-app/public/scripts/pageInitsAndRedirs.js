// Initialization Functions
function initialize() {
    firebase.initializeApp(firebaseConfig);
}

async function validate(){
  initialize();
    database = firebase.firestore();
    if(sessionStorage.getItem('NickName') !== sessionStorage.getItem('null')){
      updateNickName_JoinOrCreate(database);
    }
    let query = database.collection('Mates').where('usrToken', '==', sessionStorage.getItem('token')).get().then(snapshot =>{
        if(snapshot.empty){
            redirect("../index.html");
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
    await loadSpace();
  }

function initializeWelcome() {
  initialize();
  validate();
}
async function initializeOverview(){
  database = firebase.firestore();
  if(sessionStorage.getItem('NickName') !== sessionStorage.getItem('null')){
    updateNickName_JoinOrCreate(database);
  }
  await loadSpace();
  await displaySpaceInfo();
}
async function initializeSpaceKey(){
  await validate();
  displaySpaceInfo();
}

async function loadSpace(){
  if(!loadSpaceFromSessionStorage()){
		await loadSpaceFromFirestore();
		saveSpaceToSessionStorage();
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
  let mateRef = database.collection("Mates");
  let mateQuery = mateRef.where("usrEmail", "==", user.email);

  mateQuery
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        sessionStorage.setItem('NickName', user.displayName);
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
    .then(async function(snapshot){
      sessionStorage.setItem('user', snapshot.docs[0].id);
      let user = snapshot.docs[0].data();
      sessionStorage.setItem('NickName', user.usrNickname); //maybe delete
      let spaces = user.usrSpaces;
      if(spaces != undefined) {
        let spaceID = spaces[0].id;
        sessionStorage.setItem('Space', spaceID);
        let date = new Date();
        date.setTime(date.getTime() + 86400000);
        await database.collection('Mates').doc(sessionStorage.getItem('user')).update({
          usrExpiration:date,
          usrToken:sessionStorage.getItem('token')
        });
        redirect('../html/overview.html')
      }else {
        redirect('../html/joinOrCreateSpace.html')
      }
    });
  }
