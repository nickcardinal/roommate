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

	setCompletionStatus(completionStatus) {
		this.completionStatus = completionStatus;
	}

	getCompletionStatus(completionStatus) {
		return this.completionStatus;
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
		tskCompletionStatus: false,
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
				spcTasks: firebase.firestore.FieldValue.arrayUnion(docRef),
			});
		});

	// Waits for 1000ms before redirecting
	setTimeout(redirectOverview(), 1000);
}

function redirectCreateTask() {
	window.location.href = "../html/createTask.html";
}

function redirectOverview() {
	window.location.href = "../html/overview.html";
}

module.exports = Task;
