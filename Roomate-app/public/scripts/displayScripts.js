function displayTasks(tasks) {
    tasks.forEach(task => {
        appendTask(task);
    })
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