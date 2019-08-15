class Space {
    constructor() {
        this.name;
        this.description;
        this.spaceID;
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
	isValidSpace(spaceDocID){
		var db = firebase.firestore();
		var spcDocRef = db.collection('Spaces').doc('sFSKvtwdCrpXCMGsdkHP');
		
		db.collection("Spaces").where("spcTitle","==","The Collective")
							   .get()
							   .then(function(snap) {
									snap.forEach(function(doc) {
										console.log(doc.id, " => ", doc.data());
									});
							   })
							   .catch(function(error) {
									console.log(error);
							   });
		
		var test = spcDocRef.get()
							.then(function(doc) {
								if (doc.exists) {
									return true;
								} else {
									return false;
								}
							})
							.catch(function(error) {
								console.log("Error getting document:", error);	
								return false;
							});
							
		
	}
	
	outputMatesInSpace(){
		var db = firebase.firestore();
		var spcDocRef = db.collection('Spaces').doc('sFSKvtwdCrpXCMGsdkHP');
	}
}

function testSpace(){
	var newSpace = new Space();
	//newSpace.addMateToSpace('NickTest');
	console.log(newSpace.isValidSpace("sFSKvtwdCrpXCMGsdkHP"));
	newSpace.outputMatesInASpace();
	tester();
}


