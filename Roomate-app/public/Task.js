class Task {
  constructor(taskId, spaceId) {
  	// Task Descriptors
  	this.title;
  	this.description;

  	// Task Deadline Data
  	this.dueYear;
  	this.dueDay;
  	this.dueMonth;
  	this.dueTime; // 0000 to 2359

  	// Task Completion Details
  	this.assignedMate;
  	this.completionStatus;
  }

  // Getters/Setters: Task Descriptors
  setTitle(title) {
  	this.title = title;
  }

  getTitle() {
  	return this.title;
  }

  setDescription(description) {
  	this.description = description;
  }

  getDescription(description) {
  	return this.description;
  }

  // Getters/Setters: Task Deadline Data
  setDueYear(dueYear) {
  	this.dueYear = dueYear;
  }

  getDueYear(dueYear) {
  	return this.dueYear;
  }

  setDueMonth(dueMonth) {
  	this.dueMonth = dueMonth;
  }

  getDueMonth(dueMonth) {
  	return this.dueMonth;
  }

  setDueDay(dueDay) {
  	this.dueDay = dueDay;
  }

  getDueDay(dueDateDay) {
  	return this.dueDay;
  }

  setDueTime(dueTime) {
  	this.dueTime = dueTime;
  }

  getDueTime(dueTime) {
  	return this.dueTime;
  }

  // Getters/Setters: Task Completion Details
  setAssignedMate(assignedMate) {
  	this.assignedMate = assignedMate;
  }

  getAssignedMate(assignedMate) {
  	return this.assignedMate;
  }

  setCompletionStatus(completionStatus) {
  	this.completionStatus = completionStatus;
  }

  getCompletionStatus(completionStatus) {
  	return this.completionStatus;
  }

}

//Create Firestore Task
function createFirestoreTask() {
	var taskdb = firebase.firestore().collection("Task");

  let currTask = new Task();
  currTask.setTitle($("#titleField").val());
  currTask.setDescription($("#descriptionField").val());
  currTask.setDueYear($("#dueYearField").val());
  currTask.setDueMonth($("#dueMonthField").val());
  currTask.setDueDay($("#dueDayField").val());
  currTask.setDueTime($("#dueTimeField").val());

  let data = {
    tskTitle: currTask.getTitle(),
    tskDescription: currTask.getDescription(),
    tskDueYear: currTask.getDueYear(),
    tskDueMonth: currTask.getDueMonth(),
    tskDueDay: currTask.getDueDay(),
    tskDueTime: currTask.getDueTime(),
  }

	taskdb.add(data);
}
