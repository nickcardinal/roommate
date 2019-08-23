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
//Andre's function
function completeTask(){
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
		mySpace = JSON.parse(mySpaceJSON);
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
//Returns Mates array from mySpace
function getMatesInSpace() {
    return mySpace.getMates();
}
//Returns Tasks array from mySpace
function getAllTasks() {
    return mySpace.getTasks();
}
//Returns a filtered task array of all tasks matching userID in Session Storage.
function getMyTasks(){
	let currMateID = sessionStorage.getItem("user");
	mySpace.getTasks().filter(task => {
		return task.assignMate == currMateID;
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
