function print(l){
    l.forEach(int => {
        console.log(int.id + ':', int.tasks);
    })
}

function algorithm(list){
    list.sort((a, b) => (a.tasks >= b.tasks) ? 1 : -1);
    let min = list[0].tasks;
    let prev = list[0].tasks;
    list[0].tasks = list[list.length - 1].tasks;
    for (let i = 1; i < list.length; i++) {
        let n = list[i].tasks;
        list[i].tasks = list[i - 1].tasks - (list[i].tasks - prev);
        prev = n;
    }
    for (let i = 0; i < list.length; i++) {
        list[i].tasks = list[i].tasks + 1 - min;
        list[i].tasks = Math.pow(Math.pow(list.length, 1/3)*3 -2, list[i].tasks);
    }
    list.sort((a, b) => (a.id >= b.id) ? 1 : -1);
}

function giveTask(taskList){
    let list = new Array();
    taskList.forEach(int => {
        list.push(Object.assign({}, int));
    })
    algorithm(list);
    let totalWeight = 0;
    list.forEach(int => {
        totalWeight += int.tasks;
    });
    let rand = Math.floor(Math.random()*totalWeight);
    for(let i = 0;  i < list.length; i++){
        rand -= list[i].tasks;
        if(rand <= 0){
            taskList[i].tasks++;
            return i;
        }
    }
}

function tester(){
    let list = new Array();
    for (let i = 0; i < 10; i++) {
        list.push({ tasks: Math.floor(Math.random() * 10), id: i });
    }
    print(list);
    console.log('algorithm', giveTask(list));
    print(list);
}

function main(){
    let list = new Array();
    let gap = 0;
    for (let i = 0; i < 64; i++) {
        list.push({ tasks: 0, id: i });
    }
    for(let j = 0; j < 1000000; j++){
        giveTask(list);
        let min = list[0].tasks;
        let max = list[0].tasks;
        for(let k = 1; k < list.length; k++){
            if(list[k].tasks < min){
                min = list[k].tasks;
            }
            if(list[k].tasks > max){
                max = list[k].tasks;
            }
        }
        if(max - min > 2){
            gap++;
        }
    }
    console.log(gap / 1000000);
    print(list);
}





main();
//tester();