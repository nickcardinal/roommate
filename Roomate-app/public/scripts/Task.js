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

	duplicate(task) {
		this.task_ID; //assign it to something?
		this.title = task.getTitle();
		this.description = task.getDescription();
		this.dueDate = task.getDueDate();
		this.dueTime = task.getDueTime();
		this.isRecurring = task.getIsRecurring();
		this.RecurringPeriod = task.getRecurringPeriod();
		this.assignedMate = task.getAssignedMate();
		this.isComplete = task.getIsComplete();
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

	setIsRecurring(isRecurring) {
		this.isRecurring = isRecurring;
	}

	getIsRecurring() {
		return this.isRecurring;
	}

	setRecurringPeriod(recurringPeriod) {
		this.recurringPeriod = recurringPeriod;
	}

	getRecurringPeriod() {
		return this.recurringPeriod;
	}

	// Getters/Setters: Task Completion Details
	setAssignedMate(assignedMate) {
		this.assignedMate = assignedMate;
	}

	getAssignedMate() {
		return this.assignedMate;
	}

	setIsComplete(isComplete) {
		this.isComplete = isComplete;
	}

	getIsComplete() {
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

function createTask() {
	var taskdb = firebase.firestore().collection("Tasks");
	//somehow find the space object and call createTaskByFactoryFunction()
}

function reCreateRecurringTask() {
	var taskdb = firebase.firestore().collection("Tasks");
	//find the original task using the id
	//call duplicate on the new task and pass in the old task
	//update the original task to set isComplete to true
	//update the original in json and the database
	//somehow find the space object and call reCreateTaskByFactoryFunction()
	// pass in taskdb and the new task
}

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

function calcNewDate(currDate, recurPeriod) {
		var currDate = currDate.split("-");
		currFormatedDate = currDate[1] + "/" + currDate[2] + "/" + currDate[0];

    var newDate = new Date(currFormatedDate);

		var today = new Date();
		today.getDate();

    newDate.setDate(newDate.getDate() + recurPeriod);

		while(newDate < today) {
			newDate.setDate(newDate.getDate() + recurPeriod);
		}

    var dd = newDate.getDate();
    var mm = newDate.getMonth() + 1;
    var y = newDate.getFullYear();

    var formattedDate = y + '-' + mm + '-' + dd;
    return formattedDate;
}

module.exports = Task;
