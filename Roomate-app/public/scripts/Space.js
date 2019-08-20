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
	
	setTasksArray(tasks) {
        this.tasks = tasks;
    }

    getTasks() {
        return this.tasks;
    }

    isValidSpace(spaceDocID, _callback) {
        var db = firebase.firestore();
        var spcDocRef = db.collection("Spaces").doc(spaceDocID);

        var exists = false;
        return spcDocRef.get()
						 .then(function (doc) {
							return doc;
						})
						.then(function(mate){
							return mate.exists;
						});
    }

    addMateToSpace() {
        var userDocID = sessionStorage.getItem("user");
        var userSpaceID = $("#userSpaceID").val();
        this.isValidSpace(userSpaceID).then(function (exists) {
            var isValidSpaceID = exists;
			if(!isValidSpaceID){
				alert("Invalid Space ID");
				return;
			}
			else{
				var db = firebase.firestore();
				var spcDocRef = db.collection("Spaces").doc(userSpaceID);

				db.runTransaction(transaction => {
					return transaction.get(spcDocRef).then(snapshot => {
						const spcUserArray = snapshot.get("spcMates");
						spcUserArray.push(userDocID);
						transaction.update(spcDocRef, "spcMates", spcUserArray);
						window.location.href = "../html/createTask.html";
					})
				});
			}
        });
    }

    getMateToAssignToNonRecurringTask() {
      if (this.mates.length == 0) {
        console.log("No mates in the living space.");
        return;
      }

      let minNumTasks = this.getNumberOfTasksByMateEmail(this.mates[0].getEmail());
      var minTaskMates = [];
      minTaskMates.push(this.mates[0]);

      for (var i = 1; i < this.mates.length; ++i) {
        let j = this.getNumberOfTasksByMateEmail(this.mates[i].getEmail()); //would be more efficient to get all the number of tasks in one shot...
        if (j < minNumTasks) {
          minNumTasks = j;
          minTaskMates = [];
          minTaskMates.push(this.mates[i]);
        } else if (j === minNumTasks) {
          minTaskMates.push(this.mates[i]);
        }
      }
	  
      if (minTaskMates.length > 1) {
        return minTaskMates[Math.floor(Math.random() * minTaskMates.length)];
      }
	  else{
		return minTaskMates[0];
	  }
    }

    getNextMateAssignedToRecurringTask(email) {
        for (var i = 0; i < this.mates.length - 1; ++i) {
            if (this.mates[i].getEmail() == email) {
                return this.mates[i + 1].getEmail();
            }
        }
    }
    // addTaskToSpace(taskDocID) {
    //   var db = firebase.firestore();
    //   var spcDocRef = db.collection("Spaces").doc(this.ID);
    //
    //   db.runTransaction(transaction => {
    //     return transaction.get(spcDocRef).then(snapshot => {
    //       const spcTaskArray = snapshot.get("spcTasks");
    //       spcTaskArray.push(taskDocID);
    //       transaction.update(spcDocRef, "spcTasks", spcTaskArray);
    //     });
    //   });
    // }
	getNumberOfTasksByMateEmail(email) {
      var numTasks = 0;
      for (var i = 0; i < this.tasks.length; ++i) {
        tempTask = this.tasks[i];
        if (tempTask.assignedMate.email == email &&
           !tempTask.isRecurring &&
           !tempTask.completionStatus) {
          ++numTasks;
        }
      }
      return numTasks;
    }

    fillMatesArray() {
        if(typeof this.ID === "undefined" ){
			console.log("Space ID is empty.");
			return;
        }
        var mtePromiseArray = [];
        var db = firebase.firestore();
        var spcSpaceRef = db.collection("Spaces").doc(this.ID);
        return spcSpaceRef.get().then(function (spcDoc) {
            if (spcDoc.exists) {
                spcDoc.data().spcMates.forEach(mate => {
                    var mteMateRef = db.collection("Mates").doc(mate);
                    var newMate = mteMateRef.get().then(function (mateRecord) {
                            var currMate = new Mate();
                            currMate.setID(mateRecord.id);
                            currMate.setNickName(mateRecord.data().usrNickname);
                            currMate.setFullName(mateRecord.data().usrName);
                            currMate.setEmail(mateRecord.data().usrEmail);
                            currMate.setPhotoURL(mateRecord.data().usrPhotoUrl);
                            return currMate;
                        });
                    mtePromiseArray.push(newMate);
                });
            }
            return Promise.all(mtePromiseArray);
        });
    }
	fillTasksArray() {
        if(typeof this.ID === "undefined" ){
			console.log("Space ID is empty.");
			return;
        }
        var tskPromiseArray = [];
        var db = firebase.firestore();
        var spcSpaceRef = db.collection("Spaces").doc(this.ID);
        return spcSpaceRef.get().then(function (spcDoc) {
            if (spcDoc.exists) {
                spcDoc.data().spcTasks.forEach(task => {
                    var tskTaskRef = db.collection("Tasks").doc(task);
                    var newTask = tskTaskRef.get().then(function (taskRecord) {
                            var currTask = new Task();
							currTask.setTitle(taskRecord.data().tskTitle);
							currTask.setDescription(taskRecord.data().tskDescription);
							currTask.setDueDate(taskRecord.data().tskDueDate);
							currTask.setDueTime(taskRecord.data().tskDueTime);
							currTask.setIsRecurring(taskRecord.data().tskIsRecurring);
							currTask.setIsComplete(taskRecord.data().tskIsCompleted);
							currTask.setAssignedMate(taskRecord.data().tskTitle);
                            return currTask;
                        });
                    tskPromiseArray.push(newTask);
                });
            }
            return Promise.all(tskPromiseArray);
        });
    }
    //**End of Space Class**//
}

function outputMatesAndTasksInSpace() {
    var newSpace = new Space();
	newSpace.setID('5wSYYawnb8axu29EF6PH');
    newSpace.fillMatesArray().then(function(matesArray) {
		newSpace.setMatesArray(matesArray);
		newSpace.getMates().forEach(mate => {
			mate.outputMateProperties();
		});
    });
	newSpace.fillTasksArray().then(function(tasksArray) {
		newSpace.setTasksArray(tasksArray);
		newSpace.getTasks().forEach(task => {
			task.outputTaskProperties();
		});
    });
}
function joinExistingSpace(){
	var newSpace = new Space();
	newSpace.addMateToSpace();
}
function redirectCreateNewSpace() {
    window.location.href = "../html/createNewSpace.html";
}

function redirectSpaceKey() {
    window.location.href = "../html/overview.html";
}

function outputFunction(exists) {
    return exists;
}

function createFirestoreSpace() {
    let spacedb = firebase.firestore().collection("Spaces");

    let currMateID = sessionStorage.getItem("user");
    let matedb = firebase
        .firestore()
        .collection("Mates")
        .doc(currMateID);

    let data = {
        spcTitle: $("#spaceTitle").val(),
        spcDescription: $("#spaceDescription").val(),
        spcMates: firebase.firestore.FieldValue.arrayUnion(currMateID)
    };

    spacedb
    .add(data)
    .then(function (docRef) {
        sessionStorage.setItem("Space", docRef.id);
        matedb.update({
            usrSpaces: firebase.firestore.FieldValue.arrayUnion(docRef)
        });
    })
    .then(result => {
        window.location.href = "spaceKey.html";
    })
    .catch(function (error) {
        console.error("Error adding document: ", error);
    });
}

function accessFirestoreSpace(ID, _callback) {
    let space = new Space();
    let spacedb = firebase
        .firestore()
        .collection("Spaces")
        .doc(ID);
    let getSpace = spacedb
        .get()
        .then(doc => {
            if (!doc.exists) {
                console.log("No such document!");
            } else {
                space.setDescription(doc.data().spcDescription);
                space.setTitle(doc.data().spcTitle);
                space.setID(doc.id);

                _callback(space);
            }
        })
        .catch(err => {
            console.log("Error getting document", err);
        });
}

function reWriteFirestoreSpace(ID, space) {
    //not tested may not work
    let spacedb = firebase.firestore().collection("Spaces");

    let data = {
        spcTitle: space.getTitle(),
        spcDescription: space.getDescription()
    };
    spacedb.doc(ID).set(data);
}

function testAssignTask() {
    let user1 = new Mate();
    let user2 = new Mate();
    let user3 = new Mate();
    let space = new Space();
    user1.setEmail("user1@mail.com");
    user2.setEmail("user2@mail.com");
    user3.setEmail("user3@mail.com");
    user1.setFullName("user1");
    user2.setFullName("user2");
    user3.setFullName("user3");
    space.setTitle("Space");
    space.addMate(user1);
    space.addMate(user2);
    space.addMate(user3);
    for (let i = 0; i < 50; i++) {
        let task = new Task();
        task.setTitle("Task # " + i);
        space.randomAssignMateToTask(task);
        console.log(task.getAssignedMate(), "assigned.");
        space.addTask(task);
    }
}

module.exports = Space;
