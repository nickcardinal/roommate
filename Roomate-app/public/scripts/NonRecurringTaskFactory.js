class NonRecurringTaskFactory() {
  constructor() {
    this.task = new Task();
  }

  createTask(taskdb) {
    populateTask();
    insertTaskIntoFirestore(taskdb);
    //json here
    return this.task;
  }

  populateTask() {
    this.task.setTitle($("#titleField").val());
    this.task.setDescription($("#descriptionField").val())
    this.task.setDueDate($("#dueDateField").val());
    this.task.setDueTime($("#dueTimeField").val());
    this.task.setIsRecurring(false);
    this.task.setRecurringPeriod(0);
    this.task.getAssignedMate();
    this.task.setIsComplete(false);
  }

  insertTaskIntoFirestore(taskdb) {
    // Setting firestore data
    let data = {
      tskTitle: this.task.getTitle(),
      tskDescription: this.task.getDescription(),
      tskDueDate: this.task.getDueDate(),
      tskDueTime: this.task.getDueTime(),
      tskIsRecurring: this.task.getRecurringPeriod(),
      tskRecurringPeriod: this.task.getRecurringPeriod(),
      tskAssignedMate: this.task.getAssignedMate().getID(),
      tskIsComplete: this.task.getIsComplete()
    }

    // Add Task to Space
    taskdb
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
