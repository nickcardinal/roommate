const Space = require("./Space.js");
const Mate = require("./Mate.js");
//create some data;

let spaces = new Space[new Space(), Space(), Space(), Space(), Space()];//length = 5

/*
test('some description', function(){
    expect(some call).toEqual(expected result);
});
*/

for(let i = 0; i < 2; i++){
    spaces[i].setTitle('Space ' + i);
    spaces[i].setDescription('Space description for ' + i);
    spaces[i].setID('IDFORSPACE' + i);
    for(let j = 0; j < 5; j++){
        let mate = new Mate();
        mate.setID('MATEID' + j + 'SPACEID' + i);
        mate.setNickName('m' + j);
        mate.setFullName('Mate ' + j);
        mate.setEmail('mate' + j + 's' + i + '@test.com');
        mate.setPhotoURL('mate' + j +'ulr' + i);
        spaces[i].addMate(mate);
    }
}

console.log('Initialized');

test('Set Title set proper title for space 1', function(){
    expect(spaces[1].getTitle()).toEqual('Space 1');
});

test('Set Description set proper description for space 1', function(){
    expect(spaces[1].getDescription()).toEqual('Space description for 1');
});

test('Set ID set proper ID for space 1', function(){
    expect(spaces[1].getID()).toEqual('IDFORSPACE1');
});

test('add Mate set proper mate 3 for space 1', function(){
    expect(spaces[1].getMates()[3].getEmail).toEqual('mate3s1@test.com');
});

test('Set Title set proper title for space 2', function(){
    expect(spaces[2].getTitle()).toEqual('Space 2');
});

test('Set Description set proper description for space 1', function(){
    expect(spaces[1].getDescription()).toEqual('Space description for 1');
});

test('Set ID set proper ID for space 2', function(){
    expect(spaces[2].getID()).toEqual('IDFORSPACE2');
});

test('add Mate set proper mate 3 for space 2', function(){
    expect(spaces[2].getMates()[3].getEmail).toEqual('mate3s2@test.com');
});
