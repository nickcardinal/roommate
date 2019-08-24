var mySpace = new Space();

/*************************************

Functions that Access Firestore

 ***************************************/

//Inserts Space into Firestore Spaces table && adds Space to Mates.usrSpaces
function createSpace() { //Tested
    let currMateID = sessionStorage.getItem("user");
    let newSpace = {
        spcTitle: $("#spaceTitle").val(),
        spcDescription: $("#spaceDescription").val(),
        spcMates: firebase.firestore.FieldValue.arrayUnion(currMateID)
    };

    addSpaceToFirestore(newSpace).then(spaceRef => {
        //Save spaceID to session storage.
        sessionStorage.setItem("Space", spaceRef.id);
        addSpaceRefToMatesSpaces(spaceRef, currMateID).then(redir => {
            redirect("./spaceKey.html");
        });
    })
    .catch(function (error) {
        alert("Error creating Space: ", error);
    });
}
//Inserts Space into Firestore Spaces table
function addSpaceToFirestore(newSpace) { //Tested
    var firestoreDB = firebase.firestore();
    let spacedb = firestoreDB.collection("Spaces");
    return spacedb.add(newSpace);
}
//Add spaceRef to Mates.usrSpaces firebase collection.
async function addSpaceRefToMatesSpaces(spaceRef, currMateID) { //Tested
    let mateDocRef = firebase.firestore().collection("Mates").doc(currMateID);
    await mateDocRef.get().then(mateDoc => {
        let mateSpaces = mateDoc.data().usrSpaces;
        if (mateSpaces === undefined) {
            mateSpaces = new Array();
        }
        mateSpaces.push(spaceRef);
        mateDocRef.update({
            usrSpaces: mateSpaces
        });
    })
}
//Add mateRef to Spaces.spcMates firebase collection.
async function addMateRefToSpacesMates(mateRef, currSpaceID) { //Tested
    let spcDocRef = firebase.firestore().collection("Spaces").doc(currSpaceID);
    await spcDocRef.get().then(spcDoc => {
        let spcMates = spcDoc.data().spcMates;
        if (spcMates === undefined) {
            spcMates = new Array();
        }
        spcMates.push(mateRef);
        spcDocRef.update({
            spcMates: spcMates
        });
    })
}
//Pulls SpaceID from joinSpace.html && adds mateRef to Spaces.spcMates && adds Space to Mates.usrSpaces
async function addMateToSpace() { //Tested
    var currMateID = sessionStorage.getItem("user");
    var userSpaceID = $("#userSpaceID").val();

    this.isValidSpace(userSpaceID).then(async function (exists) {
        var isValidSpaceID = exists;
        if (!isValidSpaceID) {
            alert("Invalid Space ID");
            return;
        } else {
            let spcDocRef = firebase.firestore().collection("Spaces").doc(userSpaceID);
            await addSpaceRefToMatesSpaces(spcDocRef, currMateID).then(async function (none) {
                await addMateRefToSpacesMates(currMateID, userSpaceID);
                //Save spaceID to session storage.
                sessionStorage.setItem('Space', userSpaceID);
            }).then(redir => {
                redirect('../html/overview.html');
            })
        }
    });
}
//Validates that spaceDocID exists in Firestore Spaces table
function isValidSpace(spaceDocID) { //Tested
    var spcDocRef = firebase.firestore().collection("Spaces").doc(spaceDocID);
    var exists = false;
    return spcDocRef.get()
    .then(function (doc) {
        return doc;
    })
    .then(function (mate) {
        return mate.exists;
    });
}

//Andre's function
async function createTaskByFactory() {
  var factory;
	var tasksCollection = firebase.firestore().collection('Tasks');
	var matesArray =  getMatesInSpace();
  var tasksArray = getAllTasks();
    if ($('#isRecurringField').is(':checked')) {
        factory = new RecurringTaskFactory(tasksCollection, matesArray, tasksArray);
    } else {
        factory = new NonRecurringTaskFactory(tasksCollection, matesArray, tasksArray);
    }
    //Need to move assignMate functions to respective factories.
    newTask = factory.createTask();
    addTaskToSpace(newTask);
    saveSpaceToSessionStorage();
    await syncData();
    redirect("../html/overview.html");
}
//This function will branch based on Recurring/Nonrecurring
//Functionality for marking a task as complete should be moved to the Task Object class.
//Only allows for you to complete your own tasks
async function completeTask(taskID){
  task = getTasksByID(taskID)[0];
  if(task.getAssignedMateID() === sessionStorage.getItem('user') || task.getFavourMate() === sessionStorage.getItem('user')){
  //if((task.favourMate === '' && sessionStorage.getItem('user') === task.assignedMate)|| task.favourMate === sessionStorage.getItem('user')){
  //marks task with id taskID as completed
  if(task.getIsRecurring()){
      let fact = new RecurringTaskFactory(firebase.firestore().collection('Tasks'), getMatesInSpace());
      await fact.reCreateTask(task);
      await task.pushComplete();
      saveSpaceToSessionStorage();
      location.reload();
    }else{
      await task.pushComplete();
      saveSpaceToSessionStorage();
      location.reload();
    }
}else{
    if(task.getFavourMate !== ''){//cannot have more than one mate favour a task.
        location.reload();
        return;
    }else{
           await favourTask(task);
           saveSpaceToSessionStorage();
           location.reload();
           return;
         }
}
}
//Morgan's function stub
async function favourTask(task){

}

function sortTasksByDate(tasksArray) {
    tasksArray.sort((taskA, taskB) => {

        // Check Date: recent first
        if (taskA.getDueDate() > taskB.getDueDate()) {
            return 1;
        } else if (taskA.getDueDate() === taskB.getDueDate()) {

            // Check Time: recent first
            if (taskA.getDueTime() >= taskB.getDueTime()) {
                return 1;
            }
        }
        return -1;
    });
}
/*********************************************

Functions that access  mySpace Object

 **********************************************/

//Saves mySpace to Session Storage in JSON format.
function saveSpaceToSessionStorage() {
    let currSpaceID = sessionStorage.getItem("Space");
    var mySpaceJSON = JSON.stringify(mySpace);
    sessionStorage.setItem('mySpaceJSON', mySpaceJSON);
}
//Loads mySpace from Firestore Spaces table.
async function loadSpaceFromFirestore() {
    let currSpaceID = sessionStorage.getItem("Space");
    mySpace = new Space();
    await mySpace.populateFromFirestore(currSpaceID, loadSpaceFromFirestoreCallback);
	return true;
}
//Loads mySpace from Session Storage JSON.
function loadSpaceFromSessionStorage() {
    let mySpaceJSON = sessionStorage.getItem("mySpaceJSON");
    if (!mySpaceJSON || !JSON.parse(mySpaceJSON).isLoaded) {
        //alert("mySpaceJSON is empty.");
        return false;
    } else {
        mySpace.importJSON(JSON.parse(mySpaceJSON));
        return true;
    }
}
//Returns ID from mySpace
function getSpaceID() {
    return mySpace.getID();
}
//Returns Title from mySpace
function getSpaceTitle() {
    return mySpace.getTitle();
}
//Returns Description from mySpace
function getSpaceDescription() {
    return mySpace.getDescription();
}
//Returns Mate object matching userID in mySpace mates array.
function getMateByID(userID) {
    return mySpace.getMates().filter(mate => {
        return mate.getID() === userID;
    });
}
//Returns Mates array from mySpace
function getMatesInSpace() {
    return mySpace.getMates();
}
//Returns Tasks array from mySpace
function getAllTasks() {
    return mySpace.getTasks();
}

//Returns whole space
function getSpace() {
    return mySpace;
}
//Returns a filtered task array of all tasks matching userID in Session Storage.
function getMyTasks() {
    let currMateID = sessionStorage.getItem("user");
    mySpace.getTasks().filter(task => {
        return task.assignMate === currMateID;
    });
}
//Returns Task object matching taskID in mySpace tasks array.

function getTasksByID(taskID){
	return mySpace.getTasks().filter(task => {
		return task.getTaskID() === taskID;
	});
}
//Adds Task to mySpace
function addTaskToSpace(newTask) {
    mySpace.addTask(newTask);
}

//Callback function for loadSpaceFromFirestore();
function loadSpaceFromFirestoreCallback(type, value) {
    if (type === 'title') {
        mySpace.setTitle(value);
    } else if (type === 'description') {
        mySpace.setDescription(value);
    } else if (type === 'mates') {
        //removes null values from array
        mySpace.setMatesArray(value.filter(x => x));
    } else if (type === 'tasks') {
        //removes null values from array
        mySpace.setTasksArray(value.filter(x => x));
    }
}

async function syncData() {
    await loadSpaceFromFirestore();
    saveSpaceToSessionStorage();
}
