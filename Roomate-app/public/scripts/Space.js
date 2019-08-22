const RecurringTaskFactory = require('./RecurringTaskFactory.js')
const NonRecurringTaskFactory = require('./NonRecurringTaskFactory.js')


class Space {
    constructor() {
		this.ID;
        this.title;
        this.description;
        this.mates = [];
        this.tasks = [];
		this.isLoaded = false;
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
  
    sortTasksByDate(tasksArray) {
      tasksArray.sort((taskA, taskB) => {

        // Check Date: recent first
        if(taskA.getDueDate() > taskB.getDueDate()) {
          return 1;
        } else if(taskA.getDueDate() === taskB.getDueDate()){

          // Check Time: recent first
          if(taskA.getDueTime() >= taskB.getDueTime()) {
            return 1;
          }
        }
        return -1;
      });
    }
      
    createTaskByFactory(taskdb) {
    	var factory;
      var mate;

    	if ($('#isRecurringField').is(':checked')) { //test this
    		factory = new RecurringTaskFactory(taskdb);
        mate = this.setFirstMateAssignedToRecurringTask();
    	}
    	else {
    		factory = new NonRecurringTaskFactory(taskdb);
        mate = this.setMateToNonRecurringTask();
    	}

    	this.addTask(factory.createTask(mate));
    }

    reCreateRecurringTaskByFactory(task, taskdb) {
      var factory = new RecurringTaskFactory(taskdb);
      task.setAssignedMate(this.setNextMateAssignedToRecurringTask(task.getAssignedMate()));
      //task.setDueDate() //call Morgan's function
      this.addTask(factory.reCreateTask(task));
    }

    isValidSpace(spaceDocID) {
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
        sessionStorage.setItem('Space', userSpaceID);
				var db = firebase.firestore();
				var spcDocRef = db.collection("Spaces").doc(userSpaceID);
                let mateDocRef = db.collection('Mates').doc(userDocID);
                db.collection('Mates').doc(userDocID).get().then(result => {
                    let mateSpaces = result.data().usrSpaces;
                    if(mateSpaces === undefined){
                        mateSpaces = new Array();
                    }
                    mateSpaces.push(spcDocRef);
                    mateDocRef.update({
                        usrSpaces: mateSpaces
                    });
                    spcDocRef.get().then(result => {
                      let mteArr = result.data().spcMates;
                      mteArr.push(userDocID);
                      spcDocRef.update({spcMates:mteArr}).then(result =>{
                        redirect('../html/overview.html');
                      });
                    });
                });
			}
    });
  }

  setMateToNonRecurringTask() {
    if (this.mates.length == 0) {
      console.log("No mates in the living space.");
      return;
    }

    let minNumTasks = this.getNumberOfMatesNonRecurringTasks(this.mates[0]);
    var minTaskMates = [];
    minTaskMates.push(this.mates[0]);

    for (var i = 1; i < this.mates.length; ++i) {
      let j = this.getNumberOfMatesNonRecurringTasks(this.mates[i]); //would be more efficient to get all the number of tasks in one shot...
      if (j < minNumTasks) {
        minNumTasks = j;
        minTaskMates = [];
        minTaskMates.push(this.mates[i]);
      } else if (j === minNumTasks) {
        minTaskMates.push(this.mates[i]);
      }
      //console.log(minTaskMates);
    }

    if (minTaskMates.length > 1) {
      return minTaskMates[Math.floor(Math.random() * minTaskMates.length)];
    } else {
      return minTaskMates[0];
    }
  }

  setFirstMateAssignedToRecurringTask() {
    if (this.mates.length == 0) {
      alert("No mates in the living space.");
      return;
    }

    let minNumTasks = this.getNumberOfMatesRecurringTasks(this.mates[0]);
    var minTaskMates = [];
    minTaskMates.push(this.mates[0]);

    for (var i = 1; i < this.mates.length; ++i) {
      let j = this.getNumberOfMatesRecurringTasks(this.mates[i]); //would be more efficient to get all the number of tasks in one shot...
      if (j < minNumTasks) {
        minNumTasks = j;
        minTaskMates = [];
        minTaskMates.push(this.mates[i]);
      } else if (j == minNumTasks) {
        minTaskMates.push(this.mates[i]);
      }
    }

    if (minTaskMates.length > 1) {
      return minTaskMates[Math.floor(Math.random() * minTaskMates.length)];
    } else {
      return minTaskMates[0];
    }
  }

  setNextMateAssignedToRecurringTask(mate) {
    for (var i = 0; i < this.mates.length - 1; ++i) {
      if (this.mates[i] == mate) {
          return this.mates[i + 1];
      }
    }
    return this.mates[0];
  }

  getNumberOfMatesNonRecurringTasks(mate) {
    var numTasks = 0;
    for (var i = 0; i < this.tasks.length; ++i) {
      var tempTask = this.tasks[i];
      //console.log(tempTask);
      if (tempTask.assignedMate == mate &&
         !tempTask.isRecurring &&
         !tempTask.isComplete) {
           ++numTasks;
      }
    }
    return numTasks;
  }

  getNumberOfMatesRecurringTasks(mate) {
    var numTasks = 0;
    for (var i = 0; i < this.tasks.length; ++i) {
      var tempTask = this.tasks[i];
      if (tempTask.assignedMate == mate &&
          tempTask.isRecurring &&
         !tempTask.isComplete) {
           ++numTasks;
      }
    }
  }

	async populateSpace(space_ID, _callback){
		 if(space_ID === "undefined" ){
			alert("Space ID is empty.");
			return;
		 }
		 else{
			this.setID(space_ID);
		 }

		var db = firebase.firestore();
        var spcSpaceRef = db.collection("Spaces").doc(this.ID);
		await spcSpaceRef.get().then(function (spcDoc) {
			if(spcDoc.exists){
				_callback('title', spcDoc.data().spcTitle);
				_callback('description', spcDoc.data().spcDescription);
			}
		}).then(async none => {
			await this.fillMatesArray().then(function(matesArray) {
				_callback('mates', matesArray);
			});

			await this.fillTasksArray().then(function(tasksArray) {
				_callback('tasks', tasksArray);
			});
		}).then(none => {
			this.isLoaded = true;
		})
	}

  fillMatesArray() {
    if(typeof this.ID === "undefined" ){
      alert("Space ID is empty.");
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
			alert("Space ID is empty.");
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
        redirect("./spaceKey.html");
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
