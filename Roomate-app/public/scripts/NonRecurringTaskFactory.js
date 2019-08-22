const Mate = require('./Mate.js')
const Task = require('./Task.js')

class NonRecurringTaskFactory {
  constructor(taskdb) {
    this.task = new Task();
    this.mate = new Mate();
    this.taskdb = taskdb;
  }

  createTask(mate) {
    this.mate = mate;
    populateTask();
    insertTaskIntoFirestore();
    //json here...
    return this.task;
  }

  populateTask() {
    this.task.setTitle($("#titleField").val());
    this.task.setDescription($("#descriptionField").val())
    this.task.setDueDate($("#dueDateField").val());
    this.task.setDueTime($("#dueTimeField").val());
    this.task.setIsRecurring(false);
    this.task.setRecurringPeriod(0);
    this.task.setAssignedMate(this.mate);
    this.task.setIsComplete(false);
  }

  insertTaskIntoFirestore() {
    // Setting firestore data
    let data = {
      tskTitle: this.task.getTitle(),
      tskDescription: this.task.getDescription(),
      tskDueDate: this.task.getDueDate(),
      tskDueTime: this.task.getDueTime(),
      tskIsRecurring: this.task.getRecurringPeriod(),
      tskRecurringPeriod: this.task.getRecurringPeriod(),
      tskAssignedMateID: this.task.getAssignedMate().getID(),
      tskIsComplete: this.task.getIsComplete()
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
      then(none => {
        redirect("../html/overview.html");
      });
    });
  }
}

module.exports = NonRecurringTaskFactory;
