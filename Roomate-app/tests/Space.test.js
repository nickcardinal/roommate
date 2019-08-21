
//create some data;

/*
test('some description', function(){
    expect(some call).toEqual(expected result);
});
*/

const Space = require("../public/scripts/Space.js");
const Mate = require("../public/scripts/Mate.js");
const Task = require("../public/scripts/Task.js")

var space = new Space();

// Getter/Setter tests
var title = "The Collective";
var description = "A Co-Living Space";
var space_ID = "OFWGKTA";

test("Space Setter Test", function() {

  space.setTitle(title);
  space.setDescription(description);
  space.setID(space_ID);

  expect([space.title, space.description, space.ID])
    .toEqual([title, description, space_ID]);
});

test("Space Getter Test", function() {
  space.title = title;
  space.description = description;
  space.ID = space_ID;

  expect([space.getTitle(), space.getDescription(), space.getID()])
    .toEqual([title, description, space_ID]);
});


test('add Mate set proper mate 3 for Space', function(){
  for(let j = 0; j < 5; j++){
      let mate = new Mate();
      mate.setID('MATEID' + j + 'SPACEID');
      mate.setNickName('m' + j);
      mate.setFullName('Mate ' + j);
      mate.setEmail('mate' + j + '@test.com');
      mate.setPhotoURL('mate' + j +'ulr');
      space.addMate(mate);
  }

  expect(space.getMates()[3].getEmail()).toEqual('mate3@test.com');
});

let testSpace = new Space();

//Tests for recurring Assignment

var recurTask = new Task();
recurTask.setTitle("Trash Day");
recurTask.setDescription("Throw out trash and replace trash bags");
recurTask.setTaskID("67890");
recurTask.setIsRecurring(true);
recurTask.setIsComplete(false);

recurTask.setAssignedMate(testSpace.setFirstMateAssignedToRecurringTask());

console.log(recurTask);

recurTask.setAssignedMate(testSpace.setNextMateAssignedToRecurringTask(recurTask.getAssignedMate()));

console.log(recurTask);

//placed recurring tasks to make sure that nonrecurring task will ignore them


var task1 = new Task();
task1.setTitle("Wash Dishes");
task1.setDescription("Hand Wash Pots and Pans");
task1.setTaskID("123456");
task1.setIsRecurring(false);
task1.setIsComplete(false);

var task2 = new Task();
task2.setTitle("Feed Tiny");
task2.setDescription("Feed him dog food, not human food lol");
task2.setTaskID("83893");
task2.setIsRecurring(false);
task2.setIsComplete(false);

var task3 = new Task();
task3.setTitle("Mow Lawn");
task3.setDescription("Guest are coming");
task3.setTaskID("09712");
task3.setIsRecurring(false);
task3.setIsComplete(false);


var task4 = new Task();
task4.setTitle("Pickup Amazon Package");
task4.setDescription("It will be dropped off at back door");
task4.setTaskID("15872");
task4.setIsRecurring(false);
task4.setIsComplete(false);

var task5 = new Task();
task5.setTitle("Pickup Milk");
task5.setDescription("Lactose free");
task5.setTaskID("129743");
task5.setIsRecurring(false);
task5.setIsComplete(false);

task1.setAssignedMate(testSpace.setMateToNonRecurringTask());
testSpace.addTask(task1);
console.log(task1);

task2.setAssignedMate(testSpace.setMateToNonRecurringTask());
testSpace.addTask(task2);
console.log(task2);

task3.setAssignedMate(testSpace.setMateToNonRecurringTask());
testSpace.addTask(task3);
console.log(task3);

task4.setAssignedMate(testSpace.setMateToNonRecurringTask());
testSpace.addTask(task4);
console.log(task4);

recurTask.setAssignedMate(testSpace.setNextMateAssignedToRecurringTask(recurTask.getAssignedMate()));
console.log(recurTask);

task5.setAssignedMate(testSpace.setMateToNonRecurringTask());
testSpace.addTask(task5);
console.log(task5);


//break
