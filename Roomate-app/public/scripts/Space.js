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

  getTasks() {
    return this.tasks;
  }

  isValidSpace(spaceDocID, _callback) {
    var db = firebase.firestore();
    var spcDocRef = db.collection("Spaces").doc(spaceDocID);

    var exists = false;
    var test = spcDocRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          exists = true;
        } else {
          exists = false;
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
        exists = false;
      });

    return _callback(exists);
  }

  getMateToAssignToTask() {
    if (this.mates.length == 0) {
      console.log("no mates in the living space");
      return; //condition here just in case
    }

    let minNumTasks = this.getNumberOfTasksByMateEmail(
      this.mates[0].getEmail()
    );
    var minTaskMates = new Mate[this.mates[0]]();

    for (var i = 1; i < this.mates.length; ++i) {
      let j = this.getNumberOfTasksByMateEmail(this.mates[i].getEmail()); //would be more efficient to get all the number of tasks in one shot...
      if (j < minNumTasks) {
        minNumTasks = j;
        minTaskMates = new Mate[this.mates[i]]();
      } else if (j === minNumTasks) {
        minTaskMates.push(this.mates[i]);
      }
    }
    if (minTaskMates.length > 1) {
      return minTaskMates[Math.random() * minTaskMates.length];
    }
    return minTaskMates[0];
  }

  getNextMateAssignedToRecurringTask(email) {
    for (var i = 0; i < this.mates.length - 1; ++i) {
      if (this.mates[i].getEmail() == email) {
        return this.mates[i + 1].getEmail();
      }
    }
  }

  addMateToSpace(userDocID) {
    var db = firebase.firestore();
    var spcDocRef = db.collection("Spaces").doc(this.ID);

    db.runTransaction(transaction => {
      return transaction.get(spcDocRef).then(snapshot => {
        const spcUserArray = snapshot.get("spcMates");
        spcUserArray.push(userDocID);
        transaction.update(spcDocRef, "spcMates", spcUserArray);
      });
    });
  }

  outputMatesInSpace() {
    var db = firebase.firestore();
    var spcDocRef = db.collection("Spaces").doc("sFSKvtwdCrpXCMGsdkHP");
  }

  async fillMatesArray() {
    // if(typeof this.ID === "undefined" ){
    // console.log("Space ID is empty.");
    // return;
    // }
    var mtePromiseArray = [];
    var db = firebase.firestore();
    var spcSpaceRef = db.collection("Spaces").doc("0yAZm9Ny0Fka6TGI7PZr");
    return spcSpaceRef.get().then(function(spcDoc) {
      if (spcDoc.exists) {
        spcDoc.data().spcMates.forEach(mate => {
          var mteMateRef = db.collection("Mates").doc(mate);
          var newMate = mteMateRef.get().then(function(mateRecord) {
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

  getNumberOfTasksByMateEmail(email) {
    var numTasks = 0;
    for (var i = 0; i < this.tasks.length; ++i) {
      if (this.tasks[i].assignedMate.email == email) {
        ++numTasks;
      }
    }
    return numTasks;
  }

  randomAssignMateToTask(task) {
    if (this.mates.length === 1) {
      task.assignedMate = this.mates[0];
      return;
    }
    let matesNumTasks = new Array();
    this.mates.forEach(mate => {
      matesNumTasks.push({ mateEmail: mate.email, tasks: 0 }); //initialization
    });
    this.tasks.forEach(task => {
      //go through all the tasks
      let assigned = task.assignedMate.email;
      for (let i = 0; i < matesNumTasks.length; ++i) {
        //find mate
        if (matesNumTasks[i].mateEmail === assigned) {
          matesNumTasks[i].tasks++;
          break;
        }
      }
    });
    matesNumTasks.sort((a, b) => (a.email > b.email ? 1 : -1)); //sort for algorithm
    let email = this.getEmailForAssigningTask(matesNumTasks);
    this.mates.forEach(mate => {
      if (mate.email === email) {
        task.assignedMate = mate;
        return;
      }
    });
  }

  getEmailForAssigningTask(taskList) {
    let list = new Array();
    taskList.forEach(int => {
      list.push(Object.assign({}, int));
    });
    list.sort((a, b) => (a.tasks >= b.tasks ? 1 : -1));
    let min = list[0].tasks;
    let prev = list[0].tasks;
    list[0].tasks = list[list.length - 1].tasks;
    for (let i = 1; i < list.length; i++) {
      let n = list[i].tasks;
      list[i].tasks = list[i - 1].tasks - (list[i].tasks - prev);
      prev = n;
    }
    for (let i = 0; i < list.length; i++) {
      list[i].tasks = list[i].tasks + 1 - min;
      list[i].tasks = Math.pow(
        Math.pow(list.length, 1 / 3) * 3 - 2,
        list[i].tasks
      );
    }
    list.sort((a, b) => (a.email >= b.email ? 1 : -1));
    let totalWeight = 0;
    list.forEach(int => {
      totalWeight += int.tasks;
    });
    let rand = Math.floor(Math.random() * totalWeight);
    for (let i = 0; i < list.length; i++) {
      rand -= list[i].tasks;
      if (rand <= 0) {
        return taskList[i].email;
      }
    }
  }
}

function redirectCreateNewSpace() {
  window.location.href = "../html/createNewSpace.html";
}
function outputFunction(exists) {
  return exists;
}
function createFirestoreSpace() {
  let spacedb = firebase.firestore().collection("Spaces");

  let data = {
    spcTitle: $("#spaceTitle").val(),
    spcDescription: $("#spaceDescription").val(),
    spcMates: firebase.firestore.FieldValue.arrayUnion(
      sessionStorage.getItem("user")
    )
  };

  spacedb
    .add(data)
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      sessionStorage.setItem("Space", docRef.id);
      console.log(sessionStorage.getItem("Space"));
    })
    .catch(function(error) {
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

function testSpace() {
  //Run this function to show that Mates pulled from Spaces firestore and into newSpace object.
  var newSpace = new Space();
  newSpace.fillMatesArray().then(function(matesArray) {
    newSpace.setMatesArray(matesArray);
    newSpace.getMates().forEach(mate => {
      mate.outputMateProperties();
    });
  });
}
function outputMates(space) {
  space.getMates().forEach(function(mte) {
    mte.outputMateProperties();
  });
}
