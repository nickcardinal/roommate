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
  //	document.getElementById('showID').innerHTML = getSpaceID();
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
  tskMate.innerHTML = 'Task assigned to ' + task.getAssignedMate()//.getNickName();
  if(task.getFavourMate() !== ''){
    tskMate.innerHTML = 'Task favoured by ' + task.getFavourMate()//.getNickName(); //Needs to be fixed with the mates name
  }
  br.innerHTML = '<br></br>'
}
//This function will branch based on Recurring/Nonrecurring
//Functionality for marking a task as complete should be moved to the Task Object class.
function completeTask(taskID){
    //marks task with id taskID as completed
    let tasks = getAllTasks();
    tasks.forEach(task => {
        if(task.getTaskID() === taskID){
          if(task.getIsRecurring()){
            let nextTask = Object.assign(new Task(), task);
            nextTask.setFavourMate('');
            nextTask.setAssignedMate(mySpace.setNextMateAssignedToRecurringTask(task.getAssignedMate()));
            nextTask.calcNewDate();
            firebase.firestore().collection('Tasks').add(nextTask.firestoreObj()).then(result => {
              task.setIsComplete(true);
              nextTask.setTaskID(result.id);
              mySpace.addTask(nextTask);
              let spaceRef = firebase.firestore().collection('Spaces').doc(sessionStorage.getItem('Space'))
              spaceRef.get().then(space => {
                let taskList = space.data().spcTasks;
                taskList.push(nextTask.getTaskID());
                spaceRef.update({spcTasks:taskList}).then(updateRef => {
                  firebase.firestore().collection('Tasks').doc(taskID).update({tskIsComplete:true}).then(result =>{
                    location.reload()
                  });
                });
              });
            });
          }else{
            task.setIsComplete(true);
            firebase.firestore().collection('Tasks').doc(taskID).update({tskIsComplete:true}).then(result =>{
              location.reload()
            });
          }
        }
      });
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
