const Task = require("../public/scripts/Task.js");

var task_ID = 'gjh43rt43tghrj';
var title = 'Clean Dishes';
var description = 'Dish wash: plates, bowls, and cups. Hand wash: pots and pans';
var dueDate = 'Tuesday';
var dueTime = 2000;
var isRecurring = false;
var assignedMate = 'Andre';
var isComplete = false;

test('Task Setter Test', function(){
	var task = new Task();
	task.setTaskID(task_ID);
	task.setTitle(title);
	task.setDescription(description);
	task.setDueDate(dueDate);
	task.setDueTime(dueTime);
	task.setIsRecurring(isRecurring);
	task.setAssignedMate(assignedMate);
	task.setIsComplete(isComplete);

	expect([task.task_ID, task.title, task.description, task.dueDate, task.dueTime, task.isRecurring, task.assignedMate, task.isComplete])
		.toEqual([task_ID, title, description, dueDate, dueTime, isRecurring, assignedMate, isComplete]);
});

test('Task Getter Test', function(){
	var task = new Task();
	task.task_ID = task_ID;
	task.title = title;
	task.description = description;
	task.dueDate = dueDate;
	task.dueTime = dueTime;
	task.isRecurring = isRecurring;
	task.assignedMate = assignedMate;
	task.isComplete = isComplete;

	expect([task.getTaskID(), task.getTitle(), task.getDescription(), task.getDueDate(), task.getDueTime(), task.getIsRecurring(), task.getAssignedMate(), task.getIsComplete()])
		.toEqual([task_ID, title, description, dueDate, dueTime, isRecurring, assignedMate, isComplete]);
});
