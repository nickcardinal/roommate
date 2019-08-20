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
  let br = row.insertCell(0);
  tskTitle.innerHTML = task.getTitle();
  tskComplete.innerHTML = '<button onclick=completeTask(' + task.getTaskID() + ')>Mark Complete</button>';
  tskDesc.innerHTML = task.getDescription();
  tskDue.innerHTML = 'Due by ' + task.getDueDate() + ' ' + task.getDueTime();
  br.innerHTML = '<br></br>'
}

function completeTask(taskID){
    //marks task with id taskID as completed
    firebase.firestore().collection('Tasks').doc(taskID).update({tskComplete:true}).then(result =>{
        location.reload()
    }); 
}