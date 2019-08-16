class Space {
    constructor() {
        this.title;
        this.description;
        this.ID;
        this.mates = [];
        this.tasks = [];
		this.addMate();
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
	
	setMatesArray(mates) {
      this.mates = mates;
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
		spcDocRef.get()
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
	
	async fillMatesArray(){
		// if(typeof this.ID === "undefined" ){
			// console.log("Space ID is empty.");
			// return;
		// }
		var mtePromiseArray = [];
		var db = firebase.firestore();
		var spcSpaceRef = db.collection("Spaces").doc('0yAZm9Ny0Fka6TGI7PZr');
		return spcSpaceRef.get()
					   .then(function(spcDoc) {
						   if(spcDoc.exists){
								spcDoc.data().spcMates.forEach(mate => { 
									var mteMateRef = db.collection("Mates").doc(mate);
									var newMate = mteMateRef.get()
															.then(function(mateRecord) {
																  var currMate = new Mate();
																  currMate.setID(mateRecord.id);
																  currMate.setNickName(mateRecord.data().usrNickname);
																  currMate.setFullName(mateRecord.data().usrName);
																  currMate.setEmail(mateRecord.data().usrEmail);
																  currMate.setPhotoURL(mateRecord.data().usrPhotoUrl);
																  return currMate;
															})
									mtePromiseArray.push(newMate);
								})
						   }
						   return Promise.all(mtePromiseArray);
					   });
	}
}

function testSpace(){
	//Run this function to show that Mates pulled from Spaces firestore and into newSpace object.
	var newSpace = new Space();
	newSpace.fillMatesArray().then(function(matesArray){
		newSpace.setMatesArray(matesArray);
		newSpace.getMates().forEach(mate => { mate.outputMateProperties(); });
	});
}
function outputMates(space){
	space.getMates().forEach(function(mte) {
		mte.outputMateProperties();
	})
}
function outputFunction(exists){
	return exists;
}
function createFirestoreSpace() {
    let spacedb = firebase.firestore().collection("Spaces");

    //testSpace
    let currSpace = new Space();
    currSpace.setTitle("My Space");
    currSpace.setDescription("This is my new space");

    let data = {
      spcTitle: currSpace.getTitle(),
      spcDescription: currSpace.getDescription(),
      spcMates: firebase.firestore.FieldValue.arrayUnion('/Mates/mnTsbYn8LSlug7JlYsxW')
    }

    spacedb.add(data);
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