const Mate = require('./Mate.js')
const Task = require('./Task.js')

class RecurringTaskFactory {
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
    this.task.setIsRecurring(true);
    this.task.setRecurringPeriod($('#recurringPeriodField').val());
    this.task.setAssignedMate(this.setFirstMateAssignedToRecurringTask());
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
    .then(function(docRef) {
      var spaceID = sessionStorage.getItem("Space");
      var spacedb = firebase.firestore().collection("Spaces").doc(spaceID);
      await spacedb.update({
        spcTasks: firebase.firestore.FieldValue.arrayUnion(docRef.id),
      });
      return docRef.id;
    });
  }

  getNumberOfMatesRecurringTasks(mate) {
      var numTasks = 0;
      for (var i = 0; i < this.tasks.length; ++i) {
          var tempTask = this.tasks[i];
          if (tempTask.assignedMate == mate &&
              tempTask.isRecurring &&
             !tempTask.isComplete) {
              ++numTasks;
          }
      }
      return numTasks;
  }

  setFirstMateAssignedToRecurringTask() {
      if (this.mates.length == 0) {
          alert("No mates in the living space.");
          return;
      }

      let minNumTasks = this.getNumberOfMatesRecurringTasks(this.mates[0]);
      var minTaskMates = [];
      minTaskMates.push(this.mates[0]);

      for (var i = 1; i < this.mates.length; ++i) {
          let j = this.getNumberOfMatesRecurringTasks(this.mates[i]); //would be more efficient to get all the number of tasks in one shot...
          if (j < minNumTasks) {
              minNumTasks = j;
              minTaskMates = [];
              minTaskMates.push(this.mates[i]);
          } else if (j == minNumTasks) {
              minTaskMates.push(this.mates[i]);
          }
      }

      if (minTaskMates.length > 1) {
          return minTaskMates[Math.floor(Math.random() * minTaskMates.length)];
      } else {
          return minTaskMates[0];
      }
  }

  reCreateTask(oldTask) { // pass in the old task
    this.task.duplicate(oldTask);
    this.task.setAssignedMate(this.setNextMateAssignedToRecurringTask(this.task.getAssignedMate()));
    this.task.calcNewDate();
    this.task.setTaskID(this.insertTaskIntoFirestore()); // assign the ID now that it has been upoaded to db
    return this.task;
  }

  setNextMateAssignedToRecurringTask(mate) {
      for (var i = 0; i < this.mates.length - 1; ++i) {
          if (this.mates[i] == mate) {
              return this.mates[i + 1];
          }
      }
      return this.mates[0];
  }

}

module.exports = RecurringTaskFactory;
