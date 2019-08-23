const Space = require('./Space.js');

var firestoreDB = firebase.firestore();
var mySpace = new Space();

/*************************************

Functions that Access Firestore

 ***************************************/

//Inserts Space into Firestore Spaces table && adds Space to Mates.usrSpaces
function createSpace() {
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
function addSpaceToFirestore(newSpace) {
    let spacedb = firestoreDB.collection("Spaces");
    return spacedb.add(space);
}
//Add spaceRef to Mates.usrSpaces firebase collection.
function addSpaceRefToMatesSpaces(spaceRef, currMateID) {
    let mateDocRef = firestoreDB.collection("Mates").doc(currMateID);
    mateDocRef.get().then(mateDoc => {
        let mateSpaces = result.data().usrSpaces;
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
function addSpaceRefToMatesSpaces(mateRef, currSpaceID) {
    let spcDocRef = firestoreDB.collection("Spaces").doc(currSpaceID);
    spcDocRef.get().then(spcDoc => {
        let spcMates = result.data().spcMates;
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
function addMateToSpace() {
    var currMateID = sessionStorage.getItem("user");
    var userSpaceID = $("#userSpaceID").val();

    this.isValidSpace(userSpaceID).then(function (exists) {
        var isValidSpaceID = exists;
        if (!isValidSpaceID) {
            alert("Invalid Space ID");
            return;
        } else {
            let spcDocRef = firestoreDB.collection("Spaces").doc(userSpaceID);
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
function isValidSpace(spaceDocID) {
    var spcDocRef = firestoreDB.collection("Spaces").doc(spaceDocID);
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
	var tasksCollection = firestoreDB.collection('Tasks');
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
    redirect("../html/overview.html");
}
//Andre's function
function completeTask(){
  // var factory = new RecurringTaskFactory(taskdb);
  // task.setAssignedMate(this.setNextMateAssignedToRecurringTask(task.getAssignedMate()));
  // task.calcNewDate() //call Morgan's function
  // this.addTask(factory.reCreateTask(task));
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
function loadSpaceFromFirestore() {
    mySpace = new Space();
    mySpace.populateFromFirestore(currSpaceID, loadSpaceFromFirestoreCallback);
}
//Loads mySpace from Session Storage JSON.
function loadSpaceFromSessionStorage() {
    let mySpaceJSON = sessionStorage.getItem("mySpaceJSON");
    if (mySpaceJSON === "undefined") {
        alert("mySpaceJSON is empty.");
        return;
    }
    mySpace = JSON.parse(mySpaceJSON);
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
//Returns Mates array from mySpace
function getMatesInSpace() {
    return mySpace.getMates();
}
//Returns Tasks array from mySpace
function getTasksInSpace() {
    return mySpace.getTasks();
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
        mySpace.setMatesArray(value);
    } else if (type === 'tasks') {
        mySpace.setTasksArray(value);
    }
}
