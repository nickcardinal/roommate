const Space = require("../public/scripts/Space.js");
const Mate = require("../public/scripts/Mate.js");
//create some data;

let testSpace = new Space();

/*
test('some description', function(){
    expect(some call).toEqual(expected result);
});
*/

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

console.log('Initialized');

test('Set Title set proper title for space 1', function(){
    expect(testSpace.getTitle()).toEqual("Andre's Space");
});

test('Set Description set proper description for space 1', function(){
    expect(testSpace.getDescription()).toEqual("The Collective");
});

test('Set ID set proper ID for space 1', function(){
    expect(testSpace.getID()).toEqual('88RYZING');
});

test('add Mate set proper mate 3 for space 1', function(){
    expect(testSpace.getMates()[3].getEmail()).toEqual('mate3@test.com');
});

// test('Set Title set proper title for space 2', function(){
//     expect(testSpace.getTitle()).toEqual('Space 2');
// });

// test('Set Description set proper description for space 1', function(){
//     expect(testSpace.getDescription()).toEqual('Space description for 1');
// });

// test('Set ID set proper ID for space 2', function(){
//     expect(testSpace.getID()).toEqual('IDFORSPACE2');
// });

// test('add Mate set proper mate 3 for space 2', function(){
//     expect(testSpace.getMates()[3].getEmail).toEqual('mate3s2@test.com');
// });
