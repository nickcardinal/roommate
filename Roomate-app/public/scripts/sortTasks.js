
function sortTasksByDate() {
  // Pull tasks from Firebase
  var space = new Space();
  space.setID(sessionStorage.getItem('Space'));
  var tasks = space.fillTasksArray().then(function(tasksArray) {
    space.tasks = tasksArray;
    console.log("Task List: ");
    space.tasks.forEach(task => {
        console.log(task.getDueDate(), task.getDueTime());
    });
  });
}

function moveCompletedTasks() {

}
