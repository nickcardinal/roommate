class Task {
	constructor() {
		// Task Descriptors
		this.task_ID;
		this.title;
		this.description;

		// Task Deadline Data
		this.dueDate;
		this.dueTime;
		this.isRecurring;
		this.recurringPeriod;

		// Task Completion Details
		this.assignedMate;
		this.isComplete;
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

	getDueTime() {
		return this.dueTime;
	}

	getIsRecurring(isRecurring) {
		return this.isRecurring;
	}

	setIsRecurring(isRecurring) {
		this.isRecurring = isRecurring;
	}

	// Getters/Setters: Task Completion Details
	setAssignedMate(assignedMate) {
		this.assignedMate = assignedMate;
	}

	getAssignedMate(assignedMate) {
		return this.assignedMate;
	}

	setIsComplete(completionStatus) {
		this.isComplete = completionStatus;
	}

	getIsComplete(completionStatus) {
		return this.isComplete;
	}

	outputTaskProperties(){
		console.log('task_ID: ', this.task_ID);
		console.log('title: ', this.title);
		console.log('description: ', this.description);
		console.log('dueDate: ', this.dueDate);
		console.log('dueTime: ', this.dueTime);
		console.log('isRecurring: ', this.isRecurring);
		console.log('assignedMate: ', this.assignedMate);
		console.log('isComplete: ', this.isComplete);
	}
}

//Create Firestore Task
function createFirestoreTask() {
	var taskdb = firebase.firestore().collection("Tasks");
	console.log("We're in the mainframe... Task data collection has commenced.");

	// Setting firestore data
	let data = {
		tskTitle: $("#titleField").val(),
		tskDescription: $("#descriptionField").val(),
		tskDueDate: $("#dueDateField").val(),
		tskDueTime: $("#dueTimeField").val(),
		tskIsRecurring: $('#isRecurringField').is(':checked'),
		tskRecurringPeriod: $('#recurringPeriodField').val(),
		tskAssignedMate: "Unique Mate ID",
		tskIsComplete: false
	}

	// Add Task to Space
	taskdb
		.add(data)
		.then(function(docRef) {
			console.log("Task in session: " + docRef.id);
			var spaceID = sessionStorage.getItem("Space");
			console.log("Space in session: " + spaceID);
			var spacedb = firebase.firestore().collection("Spaces").doc(spaceID);
			spacedb.update({
				spcTasks: firebase.firestore.FieldValue.arrayUnion(docRef.id),
			}).
			then(none => {
				redirect("../html/overview.html");
			});
		});
}

module.exports = Task;
