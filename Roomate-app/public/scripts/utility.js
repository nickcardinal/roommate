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
    let mateDoc = await mateDocRef.get()
    let mateSpaces = mateDoc.data().usrSpaces;
    if (mateSpaces === undefined) {
        mateSpaces = new Array();
    }
    mateSpaces.push(spaceRef);
    await mateDocRef.update({
        usrSpaces: mateSpaces
    });
}
//Add mateRef to Spaces.spcMates firebase collection.
async function addMateRefToSpacesMates(mateRef, currSpaceID) { //Tested
    let spcDocRef = firebase.firestore().collection("Spaces").doc(currSpaceID);
    let spcDoc = await spcDocRef.get();
    let spaceMates = spcDoc.data().spcMates;
    if (spaceMates === undefined) {
        spaceMates = new Array();
    }
    spaceMates.push(mateRef);
    await spcDocRef.update({
        spcMates: spaceMates
    });
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
            await addSpaceRefToMatesSpaces(spcDocRef, currMateID)
            await addMateRefToSpacesMates(currMateID, userSpaceID);

            //Save spaceID to session storage.
            sessionStorage.setItem('Space', userSpaceID);

            redirect('../html/overview.html');
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

function checkLength() {
  var isFilled = true;
  var textbox = document.getElementById("titleField");
  if(textbox.value.length < 1) {
    alert("Please add a Title");
    isFilled = false;
  }
  textbox = document.getElementById("descriptionField");
  if(textbox.value.length < 1) {
    alert("Please add a Description");
    isFilled = false;
  }
  return isFilled;
}

//Andre's function
async function createTaskByFactory() {
  if (checkLength() === false) {
    return;
  }
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
  if(task.getAssignedMateID() === sessionStorage.getItem('user') || task.getFavorMateID() === sessionStorage.getItem('user')){
  //if((task.favourMate === '' && sessionStorage.getItem('user') === task.assignedMate)|| task.favourMate === sessionStorage.getItem('user')){
  //marks task with id taskID as completed
  if(task.getIsRecurring()){
      let fact = new RecurringTaskFactory(firebase.firestore().collection('Tasks'), getMatesInSpace());
      await fact.reCreateTask(task);
      await task.pushComplete();
    }else{
      await task.pushComplete();
    }
}else{
    if(task.getFavorMateID() === ''){//cannot have more than one mate favour a taskk
      await favorTask(task);
    }
  }
    saveSpaceToSessionStorage();
    //removed because when something is saved
    //refreshTasks();
}
//Morgan's function stub
async function favorTask(taskID){
  console.log('In favorTask function');
  task = getTasksByID(taskID)[0];
  task.setFavorMateID(sessionStorage.getItem('user'));

  await task.pushFavor(sessionStorage.getItem('user'));

  saveSpaceToSessionStorage();
  //refreshTasks();
}

// Splits completed Tasks from not completed
function splitCompletedTasks(tasksArray) {
  let taskObj = {complete:new Array(), incomplete:new Array()};
  tasksArray.forEach(function(task, index) {
    if(task.getIsComplete() === true) {
      taskObj.complete.push(task);
    }else{
        taskObj.incomplete.push(task);
    }
  });
  return taskObj;
}

// Sorts completed into descending and not completed to ascending
function sortTasks(tasksArray) {
  var tasks = splitCompletedTasks(tasksArray);
  tasks.incomplete.sort((taskA, taskB) => {
    // Check Date: oldest first
    if (taskA.getDueDate() > taskB.getDueDate()) {
        return 1;
    } else if (taskA.getDueDate() === taskB.getDueDate()) {
        // Check Time: oldest first
        if (taskA.getDueTime() >= taskB.getDueTime()) {
            return 1;
        }
    }
    return -1;
  });

  tasks.complete.sort((taskA, taskB) => {
      // Check Date: recent first
      if (taskA.getDueDate() < taskB.getDueDate()) {
          return 1;
      } else if (taskA.getDueDate() === taskB.getDueDate()) {
          // Check Time: recent first
          if (taskA.getDueTime() >= taskB.getDueTime()) {
              return 1;
          }
      }
      return -1;
  });
  tasksArray = tasks.incomplete.concat(tasks.complete);
  return tasksArray;
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
	if(!currSpaceID){
		return false;
	}
	else{
		await mySpace.populateFromFirestore(currSpaceID, loadSpaceFromFirestoreCallback);
		return true;
	}
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
//Reloads mySpace Mates array from Firestore.
function loadMatesInSpace(){
	mySpace.mates = [];
	mySpace.fillMatesArray();
}
//Reloads mySpace Mates array from Firestore.
function loadTasksInSpace(){
	mySpace.tasks = [];
	mySpace.fillTasksArray();
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
        return task.assignedMateID === currMateID;
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
