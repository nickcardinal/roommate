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
		this.recurringPeriod = 0;

		// Task Completion Details
		this.assignedMate;
		this.isComplete;
		this.favourMate;
	}

	duplicate(task) {
		this.task_ID; //assign it to something?
		this.title = task.getTitle();
		this.description = task.getDescription();
		this.dueDate = task.getDueDate();
		this.dueTime = task.getDueTime();
		this.isRecurring = task.getIsRecurring();
		this.recurringPeriod = task.getRecurringPeriod();
		this.assignedMate = task.getAssignedMate();
		this.isComplete = task.getIsComplete();
		this.favourMate = task.getFavourMate();
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

	setFavourMate(mate){
		this.favourMate = mate;
	}

	getFavourMate(){
		return this.favourMate;
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

	calcNewDate() {
			let currDate = this.dueDate.split("-");
			let currFormatedDate = currDate[1] + "/" + currDate[2] + "/" + currDate[0];
		//error checking
		if(this.recurringPeriod <= 0){
			this.recurringPeriod = 1;
		}
	    let newDate = new Date(currFormatedDate);

			let today = new Date();

	    newDate.setDate(newDate.getDate() + parseInt(this.recurringPeriod));

			while(newDate < today) {
				newDate.setDate(newDate.getDate() + parseInt(this.recurringPeriod));
			}//very innefficient for long times

	    let dd = newDate.getDate();
	    let mm = newDate.getMonth() + 1;
	    let y = newDate.getFullYear();
		if(dd < 10){
			dd = '0' + dd;
		}
		if(mm < 10){
			mm = '0' + mm;
		}
	    let formattedDate = y + '-' + mm + '-' + dd;
	    this.dueDate =  formattedDate;
	}
	firestoreObj(){
		return {
			tskAssignedMate: this.assignedMate.getID(),
			tskDescription: this.description,
			tskDueDate: this.dueDate,
			tskDueTime: this.dueTime,
			tskFavour: this.favourMate,
			tskIsComplete: this.isComplete,
			tskIsRecurring: this.isRecurring,
			tskRecurringPeriod: this.recurringPeriod,
			tskTitle: this.title
		}
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
		tskIsComplete: false,
		tskFavour:""
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



try{
	module.exports = Task;
}catch(e){
	
}
