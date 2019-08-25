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
        if (!space_ID) {
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
                            currTask.setFavorMateID(taskRecord.data().tskFavorMateID);
                            currTask.setSpaceID(taskRecord.data().tskSpaceID);
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
