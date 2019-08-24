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
  try{document.getElementById('showID').innerHTML = getSpaceID();}
  catch(e){}
  //accessFirestoreSpace(sessionStorage.getItem('Space'), spaceKeyShowElements);
}

// Task Display Functions
// Found in --> ../html/tasklist.html; to be moved to ../html/overview.html
async function displayTasks(table) {
  loadSpaceFromSessionStorage();
  var tasks = getAllTasks();
  sortTasksByDate(tasks);
  tasks.forEach(task => {
    appendTask(task, table);
  });
}

function appendTask(task, table) {
  if(task.getIsComplete() && 0){//change the '0' for testing purposes
    return;
  }
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
  tskMate.innerHTML = 'Task assigned to ' + getMateByID(task.getAssignedMateID())[0].getNickName();
  if(task.getFavourMate() !== ''){
    row = table.insertRow(rows.length);
    let tskFav = row.insertCell(0);
    tskFav.innerHTML = 'Task favoured by ' + getMateByID(task.getFavourMate())[0].getNickName();
  }
  br.innerHTML = '<br></br>'
}

async function resetTaskTable() {
  let table = document.getElementById("taskList");
  table.innerHTML = "";
  table.setAttribute('id', 'taskList');
  displayTasks(table);
}

// Mates Display Functions
// Found in --> ../html/mateslist.html; to be moved to ../html/overview.html
async function displayMates(table) {
  await loadSpaceFromFirestore();
    getMatesInSpace().forEach(mate => {
        appendMate(mate, table);
    });
}

function appendMate(mate, table) {
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

async function resetMateTable() {
  let table = document.getElementById("mateList");
  table.innerHTML = "";
  table.setAttribute('id', 'mateList');
  displayMates(table);
}
