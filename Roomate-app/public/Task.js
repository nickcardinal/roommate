class Task {
	constructor(taskId, spaceId) {
		this.title;
		this.description;
		this.dueDate;
		this.dueTime;
		this.assignedMate;
		this.completionStatus;
    	}

	//Title Functions
	setTitle(title) {
		this.title = title;
	}

	getTitle() {
		return this.title;
	}

	//Description Functions
	setDescription(description) {
		this.description = description;
	}

	getDescription(description) {
		return this.description;
	}

	//Due-Date Functions
	setDueDate(dueDate) {
		this.dueDate = dueDate;
	}

	getDueDate(dueDate) {
		return this.dueDate;
	}

	//Due-Time Functions
	setDueTime(dueTime) {
		this.dueTime = dueTime;
	}

	getDueTime(dueTime) {
		return this.dueTime;
	}

	//Assigned Mate Functions
	setAssignedMate(assignedMate) {
		this.assignedMate = assignedMate;
	}

	getAssignedMate(assignedMate) {
		return this.assignedMate;
	}

	//Completion Status Functions
	setCompletionStatus(completionStatus) {
		this.completionStatus = completionStatus;
	}

	getCompletionStatus(completionStatus) {
		return this.completionStatus;
	}
}
