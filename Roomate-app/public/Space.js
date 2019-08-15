class Space {
    constructor() {
        this.name;
        this.description;
        this.spaceID = '9QTPOeRYm2bjerGWsCFf';
        this.mates = [];
        this.tasks = [];
    }

    setName(name) {
      this.name = name;
    }

    getName() {
      return this.name;
    }

    setDescription(description) {
      this.description = description;
    }

    getDescription() {
      return this.description;
    }

    setSpaceID(spaceID) {
      this.spaceID = spaceId;
    }

    getSpaceID() {
      return this.spaceID;
    }

    addMate(mate) {
      this.mates.push(mate);
    }

    getMates() {
      return this.mates;
    }

    addTask(task) {
      this.tasks.push(task);
    }

    getTasks() {
      return this.tasks;
    }
	
	addMateToSpace(userDocID){
		var db = firebase.firestore();
		var spcDocRef = db.collection("Spaces").doc(this.spaceID);

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

function testSpace(){
	var newSpace = new Space();
	console.log(newSpace.isValidSpace("sFSKvtwdCrpXCMGsdkHP", outputFunction));
}
function outputFunction(exists){
	return exists;
}



