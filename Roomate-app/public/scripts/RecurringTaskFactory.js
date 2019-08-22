const Mate = require('./Mate.js')
const Task = require('./Task.js')

class RecurringTaskFactory {
  constructor(taskdb) {
    this.task = new Task();
    this.mate = new Mate();
    this.taskdb = taskdb;
  }

  createTask(mate) {
    this.mate = mate;
    this.populateTask();
    this.insertTaskIntoFirestore();
    //json here...
    return this.task;
  }
  
  createTask() {
    this.populateTask();
    this.insertTaskIntoFirestore();
    //json here...
    return this.task;
  }

  populateTask() {
    this.task.setTitle($("#titleField").val());
    this.task.setDescription($("#descriptionField").val())
    this.task.setDueDate($("#dueDateField").val());
    this.task.setDueTime($("#dueTimeField").val());
    this.task.setIsRecurring(true);
    this.task.setRecurringPeriod($('#recurringPeriodField').val());
    this.task.setAssignedMate(this.mate);
    this.task.setIsComplete(false);
    this.task.setFavourMate('');
  }

  insertTaskIntoFirestore() {
    // Setting firestore data
    let data = {
      tskTitle: this.task.getTitle(),
      tskDescription: this.task.getDescription(),
      tskDueDate: this.task.getDueDate(),
      tskDueTime: this.task.getDueTime(),
      tskIsRecurring: this.task.getIsRecurring(),
      tskRecurringPeriod: this.task.getRecurringPeriod(),
      tskAssignedMateID: this.task.getAssignedMate().getID(),
      tskIsComplete: this.task.getIsComplete(),
      tskFavour:""
    }

    // Add Task to Space in db
    this.taskdb
    .add(data)
    .then(function(docRef) {
      var spaceID = sessionStorage.getItem("Space");
      var spacedb = firebase.firestore().collection("Spaces").doc(spaceID);
      spacedb.update({
        spcTasks: firebase.firestore.FieldValue.arrayUnion(docRef.id),
      }).
      then(none => { //maybe move later
        redirect("../html/overview.html");
      });
    });
  }

  reCreateTask(task) {
    this.task = task;
    //uncomment the line below when ready
    //this.insertTaskIntoFirestore();
    //json here...
    return this.task;
  }
}

module.exports = RecurringTaskFactory;
