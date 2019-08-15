function getMateByEmail(email, database) {
  let mateRef = database.collection("Mates");
  let mate = mateRef
    .where("mteEmail", "==", email)
    .get()
    .then(snapshot => {
      console.log('TODO: getMateByEmail');
      if (snapshot.empty) {
        //New user
        return;
      }
      snapshot.forEach(doc => {
        console.log(doc.id + " " + doc.data());
      });
    }).catch(err => {
        console.log('Error getting documents');
    });
    return mate;
}

function getMateByID(docId, database) {
  let mate = database.collection("Mates").doc(docId);
  return mate;
}

function getSpaceByMate(mate, database) {
  let spaceRef = database.collection('Spaces');
  let space = spaceRef.where('spcMates', 'array-contains', mate).get().then(snapshot => {
    console.log('TODO: getSpaceByMate');
  }).catch(err => {
    console.log('Error getting document:', err);
  });
}

function getSpaceByID(docId, database) {
  return database.collection('Spaces').doc(docId);
}

function getTasksBySpace(space, database) {
  let taskRef = database.collection('Checks');
  let tasks = taskRef.where('chkSpace', '==', space).get().then(snapshot => {
    console.log('TODO: getTasksBySpace');
  }).catch(err => {
    console.log('Error getting document:', err);
  });
  
}

function getTasksByMate(mate, database) {
  let taskRef = database.collection('Checks');
  let tasks = taskRef.where('chkMate', '==', mate).get().then(snapshot=>{
    console.log('TODO: getTasksByMate');
  }).catch(err => {
    console.log('Error getting document:', err);
  });
}

function createUser(name, nickname, email, database) {
    database.collection("Mates").add({
      usrName: name,
      usrNickname: nickname,
      usrEmail: email
    });
  }

  function createSpace(spaceName, desc, database){
    database.collection("Spaces").add({
      spcName: spaceName,
      spcDesc: desc
    });
  }

  function createTask(task, desc, time, date, database) {
    database.collection("Checks").add({
      chkName: task,
      chkDesc: desc,
      chkTime: time,
      chkDate: date,
      chkComplete: false
    });
  }
  