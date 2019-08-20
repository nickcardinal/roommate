const Space = require("../public/scripts/Space.js");
const Mate = require("../public/scripts/Mate.js");
const Task = require("../public/scripts/Task.js")
//create some data;

/*
test('some description', function(){
    expect(some call).toEqual(expected result);
});
*/

let testSpace = new Space();

testSpace.setTitle("Andre's Space");
testSpace.setDescription("The Collective");
testSpace.setID("88RYZING");

for(let j = 0; j < 5; j++){
    let mate = new Mate();
    mate.setID('MATEID' + j + 'SPACEID');
    mate.setNickName('m' + j);
    mate.setFullName('Mate ' + j);
    mate.setEmail('mate' + j + '@test.com');
    mate.setPhotoURL('mate' + j +'ulr');
    testSpace.addMate(mate);
}

var task1 = new Task();
task1.setTitle("Wash Dishes");
task1.setDescription("Hand Wash Pots and Pans");
task1.setTaskID("123456");
task1.setIsRecurring(false);
task1.setIsComplete(false);

//console.log(testSpace.getMateToAssignToNonRecurringTask())

task1.setAssignedMate(testSpace.getMateToAssignToNonRecurringTask());

testSpace.addTask(task1);

console.log(testSpace.tasks[0]);

console.log('Initialized');

//console.log(task1.getAssignedMate().fullName);

test('Set Title set proper title for Space', function(){
    expect(testSpace.getTitle()).toEqual("Andre's Space");
});

test('Set Description set proper description for Space', function(){
    expect(testSpace.getDescription()).toEqual("The Collective");
});

test('Set ID set proper ID for Space', function(){
    expect(testSpace.getID()).toEqual('88RYZING');
});

test('add Mate set proper mate 3 for Space', function(){
    expect(testSpace.getMates()[3].getEmail()).toEqual('mate3@test.com');
});



//New Tests


var recurTask = new Task();
recurTask.setTitle("Trash Day");
recurTask.setDescription("Throw out trash and replace trash bags");
recurTask.setTaskID("67890");
recurTask.setIsRecurring(true);
recurTask.setIsComplete(false);

recurTask.setAssignedMate(testSpace.getFirstMateAssignedToRecurringTask());

testSpace.addTask(recurTask);

console.log(testSpace.tasks[1]);

test('testing getNextMateAssignedToRecurringTask function', function(){
    expect(recurTask.getAssignedMate()).toEqual(testSpace.mates[0]);
});
