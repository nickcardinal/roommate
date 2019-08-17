class Task {
	constructor() {
		// Task Descriptors
		this.task_ID;
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
	setTaskID(task_ID) {
		this.task_ID = task_ID;
	}

	getTaskID() {
		return this.task_ID;
	}

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
	var taskdb = firebase.firestore().collection("Task");

	//Setting local data
	let currTask = new Task();
	currTask.setTitle($("#titleField").val());
	currTask.setDescription($("#descriptionField").val());
	currTask.setDueDate($("#dueDateField").val());
	currTask.setDueTime($("#dueTimeField").val());
	currTask.setAssignedMate("Unique Mate ID");
	currTask.setCompletionStatus(false);

	//Setting firestore data
	let data = {
		tskTitle: currTask.getTitle(),
		tskDescription: currTask.getDescription(),
		tskDueDate: currTask.getDueDate(),
		tskDueTime: currTask.getDueTime(),
		tskAssignedMate: currTask.getAssignedMate(),
		tskCompletionStatus: currTask.getCompletionStatus(),
	}

	taskdb
		.add(taskData)
		.then(function(docRef) {
			//Add Task to Space
			// var spaceID = sessionStorage.getItem("Spaces");
			var spaceID = "1NBhfz2nl8cSk561ZaZH";
			var spacedb = firebase.firestore().collection("Spaces").doc(spaceID);

			let data = spacedb.update({
				spcTasks: firebase.firestore.FieldValue.arrayUnion(docRef);
			})

			// spacedb.addTaskToSpace(docRef);
		});
}
