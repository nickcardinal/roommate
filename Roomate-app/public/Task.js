class Task {
	constructor(taskId, spaceId) {
		this.title;
		this.description;
		this.dueDateTime;
		this.assignedMate;
		this.completionStatus;
    	}

	//Getters/Setters
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

	setDueDateTime(dueDateTime) {
		this.dueDate = dueDateTime;
	}

	getDueDateTime(dueDateTime) {
		return this.dueDateTime;
	}

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

	//Create Firestore Task
	function createFirestoreTask() {
		var taskdb = firebase.firestore();
		
		var currTask = new Task();

		currTask.title = "Take out the trash";
		currTask.description = "Remember to replace the bag!";
		currTask.dueDateTime = Date.now();
		currTask.assignedMate = "Unique Mate ID"
		currTask.completionStatus = true;
	}
}
