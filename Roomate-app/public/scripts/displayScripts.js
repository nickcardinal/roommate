// User Information Display Functions
// Found in --> ./html/profile.html
function displayUserInfo() {
  document.getElementById('FullName').innerHTML= sessionStorage.getItem('name');
  document.getElementById('Email').innerHTML= sessionStorage.getItem('email');
  document.getElementById('nameField').value = sessionStorage.getItem('name');
}

// Space Information Display Functions
// Found in --> ./html/spaceKey.html
function displaySpaceInfo() {
  accessFirestoreSpace(sessionStorage.getItem('Space'), spaceKeyShowElements);
}

function spaceKeyShowElements(spc) {
  document.getElementById('showName').innerHTML= spc.getTitle();
  document.getElementById('showDescription').innerHTML= spc.getDescription();
  document.getElementById('showID').innerHTML= spc.getID();
}

// Task Display Functions
// Found in --> ./html/tasklist.html; to be moved to ./html/overview.html
function displayTasks(tasks) {
    tasks.forEach(task => {
        appendTask(task);
    })
}

function displayMates() {
  var space = new Space();
  space.setID(sessionStorage.getItem('Space'));
  var mates = space.fillMatesArray().then(function(matesArray) {
    space.mates = matesArray;
    space.mates.forEach(mate => {
        appendMate(mate);
    });
  });
}

function appendMate(mate) {
  let table = document.getElementById("mateList");

  let rows = table.getElementsByTagName("tr");
  let row = table.insertRow(rows.length);

  let mteName = row.insertCell(0);
  row = table.insertRow(rows.length);

  let br = row.insertCell(0);

  mteName.innerHTML = mate.getNickName();
  br.innerHTML = '<br></br>'
}

function appendTask(task) {
  let table = document.getElementById("taskList");
  let rows = table.getElementsByTagName("tr");
  let row = table.insertRow(rows.length);
  let tskTitle = row.insertCell(0);
  let tskComplete = row.insertCell(1);
  row = table.insertRow(rows.length);
  let tskDesc = row.insertCell(0);
  row = table.insertRow(rows.length);
  let tskDue = row.insertCell(0);
  row = table.insertRow(rows.length);
  let tskMate = row.insertCell(0);
  row = table.insertRow(rows.length);
  let br = row.insertCell(0);
  tskTitle.innerHTML = task.getTitle();
  tskComplete.innerHTML = '<input type="checkbox" onclick="completeTask(' + task.getTaskID() + ')"><br>';
  tskDesc.innerHTML = task.getDescription();
  tskDue.innerHTML = 'Due by ' + task.getDueDate() + ' ' + task.getDueTime();
  tskMate.innerHTML = 'Task assigned to ' + task.getAssignedMate();
  br.innerHTML = '<br></br>'
}

function completeTask(taskID){
    //marks task with id taskID as completed
    firebase.firestore().collection('Tasks').doc(taskID).update({tskComplete:true}).then(result =>{
        location.reload()
    });
}
