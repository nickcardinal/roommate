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
function addMateRefToSpacesMates(mateRef, currSpaceID) { //Tested
    let spcDocRef = firebase.firestore().collection("Spaces").doc(currSpaceID);
    spcDocRef.get().then(spcDoc => {
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
//Pulls SpaceID from joinSpace.html and adds mateRef to Spaces.spcMate && adds Space to Mates.usrSpaces
function addMateToSpace() { //Tested
    var currMateID = sessionStorage.getItem("user");
    var userSpaceID = $("#userSpaceID").val();

    this.isValidSpace(userSpaceID).then(function (exists) {
        var isValidSpaceID = exists;
        if (!isValidSpaceID) {
            alert("Invalid Space ID");
            return;
        } else {
            let spcDocRef = firebase.firestore().collection("Spaces").doc(userSpaceID);
            addSpaceRefToMatesSpaces(spcDocRef, currMateID).then(none => {
                addSpaceRefToMatesSpaces().then(redir => {
                    //Save spaceID to session storage.
                    sessionStorage.setItem('Space', userSpaceID);
                    redirect('../html/overview.html');
                });
            });
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
function createTaskByFactory() {
    var factory;
	var tasksCollection = firebase.firestore().collection('Tasks');
	var matesArray =  getMatesInSpace();
    if ($('#isRecurringField').is(':checked')) {
        factory = new RecurringTaskFactory(tasksCollection, matesArray);
    } else {
        factory = new NonRecurringTaskFactory(tasksCollection, matesArray);
    }
    //Need to move assignMate functions to respective factories.
    newTask = factory.createTask();
    addTaskToSpace(newTask);
    saveSpaceToSessionStorage();
}
//This function will branch based on Recurring/Nonrecurring
//Functionality for marking a task as complete should be moved to the Task Object class.
//Only allows for you to complete your own tasks
function completeTask(taskID){
    task = getTaskById(taskID);
    if((task.getFavourMate() === '' && sessionStorage.getItem('user') === task.getAssignedMate() )|| task.getFavourMate() === sessionStorage.getItem('user')){
    //marks task with id taskID as completed
          if(task.getIsRecurring()){
            // let fact = new RecurringTaskFactory(firebase.firestore().collection('Tasks'));
            let nextTask = Object.assign(new Task(), task);
            task.setIsComplete(true);
            nextTask.setFavourMate('');
            nextTask.setAssignedMate(mySpace.setNextMateAssignedToRecurringTask(task.getAssignedMate()));
            nextTask.calcNewDate();
            firebase.firestore().collection('Tasks').add(nextTask.firestoreObj()).then(result => {
              nextTask.setTaskID(result.id);
              addTaskToSpace(nextTask);
              let spaceRef = firebase.firestore().collection('Spaces').doc(sessionStorage.getItem('Space'))
              spaceRef.get().then(space => {
                let taskList = space.data().spcTasks;
                taskList.push(nextTask.getTaskID());
                spaceRef.update({spcTasks:taskList}).then(updateRef => {
                  firebase.firestore().collection('Tasks').doc(taskID).update({tskIsComplete:true}).then(result =>{
                    location.reload()
                  });
                });
              });
            });
          }else{
            task.setIsComplete(true);
            firebase.firestore().collection('Tasks').doc(taskID).update({tskIsComplete:true}).then(result =>{
              location.reload()
            });
          }
        }
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
    if (!mySpaceJSON) {
        //alert("mySpaceJSON is empty.");
		return false;
    }
	else{
        let spaceData = JSON.parse(mySpaceJSON);
        mySpace.setTitle(spaceData.title);
        mySpace.setDescription(spaceData.description);
        mySpace.setID(spaceData.ID);
        mySpace.setMatesArray(spaceData.mates);
        mySpace.setTasksArray(spaceData.tasks);
        mySpace.isLoaded = spaceData.isLoaded;
		return true;
	}
}
//Returns ID from mySpace
function getSpaceID(){
	return mySpace.getID();
}
//Returns Title from mySpace
function getSpaceTitle(){
	return mySpace.getTitle();
}
//Returns Description from mySpace
function getSpaceDescription(){
	return mySpace.getDescription();
}
//Returns Mate object matching userID in mySpace mates array.
function getMateByID(userID){
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
function getSpace(){
    return mySpace;
}
//Returns a filtered task array of all tasks matching userID in Session Storage.
function getMyTasks(){
	let currMateID = sessionStorage.getItem("user");
	mySpace.getTasks().filter(task => {
		return task.assignMate === currMateID;
	});
}
//Adds Task to mySpace
function addTaskToSpace(newTask) {
    mySpace.addTask(newTask);
}

//Returns task with id passed in
function getTaskById(id){
    let tasks = mySpace.getTasks();
    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].getTaskID === id){
            return tasks[i];
        }
    }
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
