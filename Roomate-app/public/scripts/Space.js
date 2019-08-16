class Space {
    constructor() {
        this.title;
        this.description;
        this.ID;
        this.mates = [];
        this.tasks = [];
    }

    //Title Functions
    setTitle(title) {
      this.title = title;
    }

    getTitle() {
      return this.title;
    }

    //Description Functions
    setDescription(description) {
      this.description = description;
    }

    getDescription() {
      return this.description;
    }

    //ID Functions
    setID(ID) {
      this.ID = ID;
    }

    getID() {
      return this.ID;
    }

    //Mate Array Functions
    addMate(mate) {
      this.mates.push(mate);
    }

    getMates() {
      return this.mates;
    }

    //Task Array Functions
    addTask(task) {
      this.tasks.push(task);
    }

    getTasks() {
      return this.tasks;
    }

  	addMateToSpace(userDocID){
  		var db = firebase.firestore();
  		var spcDocRef = db.collection("Spaces").doc(this.ID);

  		db.runTransaction(transaction => {
  		  return transaction.get(spcDocRef).then(snapshot => {
  			const spcUserArray = snapshot.get('spcMates');
  			spcUserArray.push(userDocID);
  			transaction.update(spcDocRef, 'spcMates', spcUserArray);
  		  });
  		});
  	}

  	isValidSpace(spaceDocID, _callback){
  		var db = firebase.firestore();
  		var spcDocRef = db.collection('Spaces').doc(spaceDocID);

  		var exists = false;
  		var test = spcDocRef.get()
  							.then(function(doc) {
  								if (doc.exists) {
  									exists =  true;
  								} else {
  									exists =  false;
  								}
  							})
  							.catch(function(error) {
  								console.log("Error getting document:", error);
  								exists =  false;
  							});

  		return _callback(exists);
  	}

  	outputMatesInSpace(){
  		var db = firebase.firestore();
  		var spcDocRef = db.collection('Spaces').doc('sFSKvtwdCrpXCMGsdkHP');
  	}
}

function redirectCreateNewSpace(){
  window.location.href = "../html/createNewSpace.html";
}
function outputFunction(exists){
	return exists;
}
function createFirestoreSpace() {
    let spacedb = firebase.firestore().collection("Spaces");

    let space = new Space();
  	space.setTitle($("#spaceTitle").val());
    space.setDescription($("#spaceDescription").val());
    space.addMate(sessionStorage.getItem('user'));


    let data = {
      spcTitle: space.getTitle(),
      spcDescription: space.getDescription(),
      spcMates: firebase.firestore.FieldValue.arrayUnion('/Mates/' + space.mates[0])
    }

    spacedb.add(data).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      sessionStorage.setItem('Space', docRef.id);
      console.log(sessionStorage.getItem('Space'));

    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });

    //window.location.href = "../html/overview.html";
}

function accessFirestoreSpace(ID, _callback) {
  let space = new Space();
  let spacedb = firebase.firestore().collection("Spaces").doc(ID);
  let getSpace = spacedb.get().then(doc => {
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      space.setDescription(doc.data().spcDescription);
      space.setTitle(doc.data().spcTitle);
      space.setID(doc.id);

      _callback(space);
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });
}

function reWriteFirestoreSpace(ID, space) {
  //not tested may not work
  let spacedb = firebase.firestore().collection("Spaces");

  let data = {
    spcTitle: space.getTitle(),
    spcDescription: space.getDescription()
  }

  spacedb.doc(ID).set(data);
}
