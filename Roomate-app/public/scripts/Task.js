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
	var boolRecurring = $("#isRecurringField").val();
	console.log("We're in the mainframe... Task data collection has commenced.");

	//Setting firestore data
	let data = {
		tskTitle: $("#titleField").val(),
		tskDescription: $("#descriptionField").val(),
		tskDueDate: $("#dueDateField").val(),
		tskDueTime: $("#dueTimeField").val(),
		tskIsRecurring: $("#isRecurringField").val(),
		tskAssignedMate: "Unique Mate ID",
		tskCompletionStatus: false,
	}

	// taskdb.add(data);
	taskdb
		.add(data)
		.then(function(docRef) {
			console.log("Space in session: " + docRef);

			//Add Task to Space
			var spaceID = sessionStorage.getItem("Spaces");
			// var spaceID = "gkAhfI4OUR45Bk7a3Lcj";
			var spacedb = firebase.firestore().collection("Spaces").doc(spaceID);

			spacedb.update({
				spcTasks: firebase.firestore.FieldValue.arrayUnion(docRef),
			});

			// spacedb.addTaskToSpace(docRef);
		});

	// Waits for 1000ms before redirecting
	setTimeout(function() {window.location.href = "../html/overview.html";}, 1000);
}

function redirectCreateTask() {
	window.location.href = "../html/createTask.html";
}
