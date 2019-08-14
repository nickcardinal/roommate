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
	var taskdb = firebase.firestore();
	var currTask = new Task();

	// currTask.title = "Take out the trash";
	// currTask.description = "Remember to replace the bag!";
	// currTask.dueYear = 0;
	// currTask.dueMonth = 0;
	// currTask.dueDay = 0;
	// currTask.dueTime = 0;
	currTask.assignedMate = "Unique Mate ID"
	currTask.completionStatus = false;

	taskdb.collection("Task").add({
		tskTitle: $("#titleField").val(),
		tskDescription: $("#descriptionField").val(),

		tskDueYear: $("#dueYearField").val(),
		tskDueMonth: $("#dueMonthField").val(),
		tskDueDay: $("#dueDayField").val(),
		tskDueTime: $("#dueTimeField").val(),
	});
}
