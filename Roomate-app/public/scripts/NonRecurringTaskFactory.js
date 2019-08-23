class NonRecurringTaskFactory {
  constructor(taskdb, matesArray) {
    this.task = new Task();
    this.mates = matesArray;
    this.taskdb = taskdb;
  }

  createTask() {
    this.populateTask();
    this.task.setTaskID(this.insertTaskIntoFirestore());
    return this.task;
  }

  populateTask() {
    this.task.setTitle($("#titleField").val());
    this.task.setDescription($("#descriptionField").val())
    this.task.setDueDate($("#dueDateField").val());
    this.task.setDueTime($("#dueTimeField").val());
    this.task.setIsRecurring(false);
    this.task.setRecurringPeriod(0);
    this.task.setAssignedMate(this.setMateToNonRecurringTask());
    this.task.setIsComplete(false);
    this.task.setFavourMate('');
  }

  async insertTaskIntoFirestore() {
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
    .then(async function(docRef) {
      var spaceID = sessionStorage.getItem("Space");
      var spacedb = firebase.firestore().collection("Spaces").doc(spaceID);
      await spacedb.update({
        spcTasks: firebase.firestore.FieldValue.arrayUnion(docRef.id),
      });
      return docRef.id;
    });
  }

  getNumberOfMatesNonRecurringTasks(mate) {
      var numTasks = 0;
      for (var i = 0; i < this.tasks.length; ++i) {
          var tempTask = this.tasks[i];
          if (tempTask.assignedMate == mate &&
             !tempTask.isRecurring &&
             !tempTask.isComplete) {
              ++numTasks;
          }
      }
      return numTasks;
  }

  setMateToNonRecurringTask() {
      if (this.mates.length == 0) {
          console.log("No mates in the living space.");
          return;
      }

      let minNumTasks = this.getNumberOfMatesNonRecurringTasks(this.mates[0]);
      var minTaskMates = [];
      minTaskMates.push(this.mates[0]);

      for (var i = 1; i < this.mates.length; ++i) {
          let j = this.getNumberOfMatesNonRecurringTasks(this.mates[i]); //would be more efficient to get all the number of tasks in one shot...
          if (j < minNumTasks) {
              minNumTasks = j;
              minTaskMates = [];
              minTaskMates.push(this.mates[i]);
          } else if (j === minNumTasks) {
              minTaskMates.push(this.mates[i]);
          }
      }

      if (minTaskMates.length > 1) {
          return minTaskMates[Math.floor(Math.random() * minTaskMates.length)];
      } else {
          return minTaskMates[0];
      }
  }
}
try{
module.exports = NonRecurringTaskFactory;
}catch(e){
  
}