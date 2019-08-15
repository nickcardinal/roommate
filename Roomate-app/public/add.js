function addSpace() {
  let db = firebase.firestore();
  let name = document.spaceData.name.value;
  let ref = { 
      id: ''
  };
  if (name === "") {
    alert("Enter name for the space");
  } else {
    createSpace(name, db, ref);
    alert(name + ' has been added to the database with doc id ' + ref.id);
  }
}
function addUser() {
  let db = firebase.firestore();
  let name = document.userData.usrName.value;
  let nickname = document.userData.nickname.value;
  let email = document.userData.email.value;
  if (name === "" || nickname === "" || email === "") {
    alert("Missing data in user fields");
  } else {
    createUser(name, nickname, email, db);
    alert(name + ' has been added to the database.');
  }
}
function addTask() {
  let db = firebase.firestore();
  let task = document.taskData.tsk.value;
  let desc = document.taskData.desc.value;
  let time = document.taskData.time.value;
  let date = document.taskData.date.value;
  if (task === "" || desc === "" || time === "" || date === "") {
    alert("Missing data in task fields");
  } else {
    createTask(task, desc, time, date, db);
    alert(task + ' has been added to the database');
  }
}
