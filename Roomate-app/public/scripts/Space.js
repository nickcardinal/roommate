// const RecurringTaskFactory = require('./RecurringTaskFactory.js')
// const NonRecurringTaskFactory = require('./NonRecurringTaskFactory.js')
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

  	//Moved to utility.js
    createTaskByFactory(taskdb) {
        var factory;
        var mate;

        if ($('#isRecurringField').is(':checked')) { //test this
            factory = new RecurringTaskFactory(taskdb);
            mate = this.setFirstMateAssignedToRecurringTask();
        } else {
            factory = new NonRecurringTaskFactory(taskdb);
            mate = this.setMateToNonRecurringTask();
        }

        this.addTask(factory.createTask(mate));
    }

    //this will be called completeTask in utility.js
    reCreateRecurringTaskByFactory(task, taskdb) {
        var factory = new RecurringTaskFactory(taskdb);
        task.setAssignedMateID(this.setNextMateAssignedToRecurringTask(task.getAssignedMate()));
        task.calcNewDate() //call Morgan's function
        this.addTask(factory.reCreateTask(task));
    }

	//Moved to utility.js
    isValidSpace(spaceDocID) {
        var db = firebase.firestore();
        var spcDocRef = db.collection("Spaces").doc(spaceDocID);

        var exists = false;
        return spcDocRef.get()
        .then(function (doc) {
            return doc;
        })
        .then(function (mate) {
            return mate.exists;
        });
    }
    //Moved to utility.js
    addMateToSpace() {
        let userDocID = sessionStorage.getItem("user");
        let userSpaceID = $("#userSpaceID").val();
        this.isValidSpace(userSpaceID).then(function (isValidSpaceID) {
            if (!isValidSpaceID) {
                alert("Invalid Space ID");
                return;
            } else {
                sessionStorage.setItem('Space', userSpaceID);
                let db = firebase.firestore();
                let spcDocRef = db.collection("Spaces").doc(userSpaceID);
                let mateDocRef = db.collection('Mates').doc(userDocID);
                db.collection('Mates').doc(userDocID).get().then(result => {
                    let mateSpaces = result.data().usrSpaces;
                    if (mateSpaces === undefined) {
                        mateSpaces = new Array();
                    }
                    mateSpaces.push(spcDocRef);
                    mateDocRef.update({
                        usrSpaces: mateSpaces
                    });
                    spcDocRef.get().then(result => {
                        let mteArr = result.data().spcMates;
                        mteArr.push(userDocID);
                        spcDocRef.update({
                            spcMates: mteArr
                        }).then(result => {
                            redirect('../html/overview.html');
                        });
                    });
                });
            }
        });
    }

    //moved to NonRecurringTaskFactory
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

    //moved to RecurringTaskFactory
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

    //moved to RecurringTaskFactory
    setNextMateAssignedToRecurringTask(mate) {
        if(this.mates.length == 0){
            return new Mate();
        }
        for (var i = 0; i < this.mates.length - 1; ++i) {
            if (this.mates[i] == mate) {
                return this.mates[i + 1];
            }
        }
        return this.mates[0];
    }

    //moved to NonRecurringTaskFactory
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

    //Moved to RecurringTaskFactory
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

    importJSON(space){
        this.ID = space.ID;
        this.title = space.title;
        this.description = space.description;
        this.mates = [];
        this.tasks = [];
        this.isLoaded = space.isLoaded;
        space.mates.forEach(mate => {
            let add = new Mate();
            add.importJSON(mate);
            this.mates.push(add);
        });
        space.tasks.forEach(task => {
            let add = new Task();
            add.importJSON(task);
            this.tasks.push(add);
        });
    }

    async populateFromFirestore(space_ID, _callback) {
        if (space_ID === "undefined") {
            alert("Space ID is empty.");
            return;
        } else {
            this.setID(space_ID);
        }

        var db = firebase.firestore();
        var spcSpaceRef = db.collection("Spaces").doc(this.ID);
        await spcSpaceRef.get().then(function (spcDoc) {
            if (spcDoc.exists) {
                _callback('title', spcDoc.data().spcTitle);
                _callback('description', spcDoc.data().spcDescription);
            }
        }).then(async none => {
            await this.fillMatesArray().then(function (matesArray) {
                _callback('mates', matesArray);
            });

            await this.fillTasksArray().then(function (tasksArray) {
                _callback('tasks', tasksArray);
            });
        }).then(none => {
            this.isLoaded = true;
        })
    }
    fillMatesArray() {
        if (typeof this.ID === "undefined") {
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
                            if (mateRecord.exists) {
                                var currMate = new Mate();
                                currMate.setID(mateRecord.id);
                                currMate.setNickName(mateRecord.data().usrNickname);
                                currMate.setFullName(mateRecord.data().usrName);
                                currMate.setEmail(mateRecord.data().usrEmail);
                                currMate.setPhotoURL(mateRecord.data().usrPhotoUrl);
                                return currMate;
                            }
                        });
                    mtePromiseArray.push(newMate);
                });
            }
            return Promise.all(mtePromiseArray);
        });
    }

    fillTasksArray() {
        if (typeof this.ID === "undefined") {
            alert("Space ID is empty.");
            return;
        }
        var tskPromiseArray = [];
        var db = firebase.firestore();
        var spcSpaceRef = db.collection("Spaces").doc(this.ID);
        return spcSpaceRef.get().then(function (spcDoc) {
            if (spcDoc.data().hasOwnProperty('spcTasks')) {
                spcDoc.data().spcTasks.forEach(task => {
                    var tskTaskRef = db.collection("Tasks").doc(task);
                    var newTask = tskTaskRef.get().then(function (taskRecord) {
                        if(taskRecord.exists){
                            var currTask = new Task();
                            currTask.setTitle(taskRecord.data().tskTitle);
                            currTask.setDescription(taskRecord.data().tskDescription);
                            currTask.setDueDate(taskRecord.data().tskDueDate);
                            currTask.setDueTime(taskRecord.data().tskDueTime);
                            currTask.setIsRecurring(taskRecord.data().tskIsRecurring);
                            currTask.setIsComplete(taskRecord.data().tskIsComplete);
                            currTask.setAssignedMateID(taskRecord.data().tskAssignedMateID);
                            currTask.setFavourMate(taskRecord.data().tskFavour);
                            currTask.setTaskID(taskRecord.id);
                            currTask.setRecurringPeriod(taskRecord.data().tskRecurringPeriod);
                            return currTask;
                        }
                        });
                    tskPromiseArray.push(newTask);
                });
            }
            return Promise.all(tskPromiseArray);
        });
    }
    //**End of Space Class**//
}

try{
	module.exports = Space;
}catch(e){

}
