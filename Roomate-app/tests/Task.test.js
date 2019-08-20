const Task = require("../public/scripts/Task.js");

test('Getter/Setter Test', function(){
	var task_ID = 'gjh43rt43tghrj';
	var title = 'Clean Dishes';
	var description = 'Dish wash: plates, bowls, and cups. Hand wash: pots and pans';
	var dueDate = 'Tuesday';
	var dueTime = 2000;
	var isRecurring = false;
	var assignedMate = 'Andre';
	var completionStatus = false;

	var testTask = new Task();
	testTask.setTaskID(task_ID);
	testTask.setTitle(title);
	testTask.setDescription(description);
	testTask.setDueDate(dueDate);
	testTask.setDueTime(dueTime);
	testTask.setIsRecurring(isRecurring);
	testTask.setAssignedMate(assignedMate);
	testTask.setIsComplete(completionStatus);

	expect([testTask.getTaskID(), testTask.getTitle(), testTask.getDescription(), testTask.getDueDate(), testTask.getDueTime(), testTask.getIsRecurring(), testTask.getAssignedMate(), testTask.getIsComplete()])
		.toEqual([task_ID, title, description, dueDate, dueTime, isRecurring, assignedMate, completionStatus]);
});
