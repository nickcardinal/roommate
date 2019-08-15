class Task {
	constructor(taskId, spaceId) {
		// Task Descriptors
		this.title;
		this.description;

		// Task Deadline Data
		this.dueDate;
		this.dueTime;

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
	setDueDate(dueDate) {
		this.dueDate = dueDate;
	}

	getDueDate(dueDate) {
		return this.dueDate;
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
	currTask.assignedMate = "Unique Mate ID"
	currTask.completionStatus = false;

	taskdb.collection("Task").add({
		tskTitle: $("#titleField").val(),
		tskDescription: $("#descriptionField").val(),

		tskDueDate: $("#dueDateField").val(),
		tskDueTime: $("#dueTimeField").val(),
	});
}
