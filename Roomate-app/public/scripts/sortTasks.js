var tasksClone;

function cloneTasksArray() {
  // Pull tasks from Firebase
  var space = new Space();
  space.setID(sessionStorage.getItem('Space'));
  console.log("Pulled created temp Space object");
  tasksClone = new Array();

  // Push tasks to Cloned Task List
  var tasks = space.fillTasksArray().then(function(tasksArray) {
    console.log("Filled temp Space task Array");
    space.tasks = tasksArray;
    space.tasks.forEach(task => {
        tasksClone.push(task);
    });
  });
  outputTaskList(tasksClone);
}

// Sorts Tasks by Date then by Time
function sortTaskByDate(tasksArray) {
  tasksArray.sort((taskA, taskB) => {

    // Check Date: recent first
    if(taskA.getDueDate() > taskB.getDueDate()) {
      return 1;
    } else if(taskA.getDueDate() === taskB.getDueDate()){

      // Check Time: recent first
      if(taskA.getDueTime() >= taskB.getDueTime()) {
        return 1;
      }
    }
    return -1;
  });

  outputTaskList(tasksArray);
}

// Outputs dates and times of Task List to console
function outputTaskList(tasksArray) {
  tasksArray.forEach(task => {
    console.log(task.getDueDate(), task.getDueTime());
  });
}
