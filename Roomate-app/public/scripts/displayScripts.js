// User Information Display Functions
// Found in --> ../html/profile.html
function displayUserInfo() {
  document.getElementById('FullName').innerHTML = sessionStorage.getItem('name');
  document.getElementById('Email').innerHTML = sessionStorage.getItem('email');
  document.getElementById('nameField').value = sessionStorage.getItem('name');
}

// Space Information Display Functions
// Found in --> ../html/spaceKey.html
function displaySpaceInfo() {
  document.getElementById('showName').innerHTML = getSpaceTitle();
  document.getElementById('showDescription').innerHTML = getSpaceDescription();
  document.getElementById('showID').innerHTML = sessionStorage.getItem('Space');
  //accessFirestoreSpace(sessionStorage.getItem('Space'), spaceKeyShowElements);
}

function spaceKeyShowElements(spc) {
  document.getElementById('showName').innerHTML= spc.getTitle();
  document.getElementById('showDescription').innerHTML= spc.getDescription();
  try{
    document.getElementById('showID').innerHTML= spc.getID();
  }catch(e){

  }
}

// Task Display Functions
// Found in --> ../html/tasklist.html; to be moved to ../html/overview.html
function displayTasks(tasks) {
  var space = new Space();
  space.setID(sessionStorage.getItem('Space'));
  var tasks = space.fillTasksArray().then(function(tasksArray) {
    space.tasks = tasksArray;
    space.sortTasksByDate(space.tasks);
    space.tasks.forEach(task => {
        appendTask(task);
    });
  });
}

function appendTask(task) {
  if(task.getIsComplete() && 0){//change the '0' for testing purposes
    return;
  }
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
  if(task.getIsComplete()){
    tskComplete.innerHTML = '✅<br>';
  }else{
    tskComplete.innerHTML = '<input type="checkbox" onclick="completeTask(\'' + task.getTaskID() + '\')"><br>';
  }
  tskDesc.innerHTML = task.getDescription();
  tskDue.innerHTML = 'Due by ' + task.getDueDate() + ' ' + task.getDueTime();
  tskMate.innerHTML = 'Task assigned to ';
  if(task.getFavourMate() !== ''){
    tskMate.innerHTML = 'Task favoured by ';
    firebase.firestore().collection('Mates').doc(task.getFavourMate()).get().then(doc => {
      try{tskMate.innerHTML += doc.data().usrNickname;}
      catch(e){tskMate.innerHTML += '?';}
    });
  }else{
    firebase.firestore().collection('Mates').doc(task.getAssignedMate()).get().then(doc => {
      try{tskMate.innerHTML += doc.data().usrNickname;}
      catch(e){tskMate.innerHTML += '?';}
    });
  }
  br.innerHTML = '<br></br>'
}
// Mates Display Functions
// Found in --> ../html/mateslist.html; to be moved to ../html/overview.html
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

  let mteIcon = row.insertCell(0);
  row = table.insertRow(rows.length);

  let mteName = row.insertCell(0);
  row = table.insertRow(rows.length);

  let br = row.insertCell(0);

  mteIcon.innerHTML = '<img class ="user-icon" src=' + mate.getPhotoURL() + " " + 'alt="Checkmates Logo">';
  mteName.innerHTML = mate.getNickName();
  br.innerHTML = '<br></br>'
}
