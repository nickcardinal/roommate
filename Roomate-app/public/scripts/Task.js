class Task {
	constructor() {
		// Task Descriptors
		this.task_ID;
		this.space_ID;
		this.title;
		this.description;

		// Task Deadline Data
		this.dueDate;
		this.dueTime;
		this.isRecurring;
		this.recurringPeriod = 0;

		// Task Completion Details
		this.assignedMateID;
		this.isComplete;
		this.favorMateID;
	}

	duplicate(task) {
		//this.task_ID = null; //assign it to something
		this.title = task.getTitle();
		this.description = task.getDescription();
		this.dueDate = task.getDueDate();
		this.dueTime = task.getDueTime();
		this.isRecurring = task.getIsRecurring();
		this.recurringPeriod = task.getRecurringPeriod();
		this.assignedMateID = task.getAssignedMateID();
		this.isComplete = task.getIsComplete();
		this.space_ID = task.getSpaceID();
		this.favorMateID = task.getFavorMateID();
	}

	// Getters/Setters: Task Descriptors
	setTaskID(task_ID) {
		this.task_ID = task_ID;
	}

	getTaskID() {
		return this.task_ID;
	}

	setSpaceID(space_ID) {
		this.space_ID = space_ID;
	}

	getSpaceID() {
		return this.space_ID;
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

	setFavorMateID(mate){
		this.favorMateID = mate;
	}

	getFavorMateID(){
		return this.favorMateID;
	}

	// Getters/Setters: Task Completion Details
	setAssignedMateID(assignedMateID) {
		this.assignedMateID = assignedMateID;
	}

	getAssignedMateID() {
		return this.assignedMateID;
	}

	setIsComplete(isComplete) {
		this.isComplete = isComplete;
	}

	getIsComplete() {
		return this.isComplete;
	}

	outputTaskProperties(){
		// console.log('task_ID: ', this.task_ID);
		// console.log('space_ID: ', this.space_ID);
		// console.log('title: ', this.title);
		// console.log('description: ', this.description);
		// console.log('dueDate: ', this.dueDate);
		// console.log('dueTime: ', this.dueTime);
		// console.log('isRecurring: ', this.isRecurring);
		// console.log('assignedMateID: ', this.assignedMateID);
		// console.log('isComplete: ', this.isComplete);
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

	async pushComplete(){
		task.setIsComplete(true);
		await firebase.firestore().collection('Tasks').doc(this.task_ID).update({tskIsComplete:true});
	}

	async pushFavor(favorMateID){
		console.log('Pushing user: ' + sessionStorage.getItem('user'));
		task.setFavorMateID(favorMateID);
		await firebase.firestore().collection('Tasks').doc(this.task_ID).update({tskFavorMateID:favorMateID});
	}

	firestoreObj(){
		return {
			tskAssignedMateID: this.assignedMateID,
			tskSpaceID: this.space_ID,
			tskDescription: this.description,
			tskDueDate: this.dueDate,
			tskDueTime: this.dueTime,
			tskFavour: this.favorMateID,
			tskIsComplete: this.isComplete,
			tskIsRecurring: this.isRecurring,
			tskRecurringPeriod: this.recurringPeriod,
			tskTitle: this.title
		}
	}
	importJSON(task){
				// Task Descriptors
				this.task_ID = task.task_ID;
				this.space_ID = task.space_ID;
				this.title = task.title;
				this.description = task.description;

				// Task Deadline Data
				this.dueDate = task.dueDate;
				this.dueTime = task.dueTime;
				this.isRecurring = task.isRecurring;
				this.recurringPeriod = task.recurringPeriod;

				// Task Completion Details
				this.assignedMateID = task.assignedMateID;
				this.isComplete = task.isComplete;
				this.favorMateID = task.favorMateID;
	}
}

try{
	module.exports = Task;
}catch(e){

}
