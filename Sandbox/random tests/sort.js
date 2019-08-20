function print(list){
    list.forEach(item => {
        console.log('a:',item.a, '\tb:', item.b, '\tc:', item.c);
    });
}

let list = new Array();
let i = 0;
for(i = 0; i < 100; i++){
    list.push({a:Math.floor(Math.random() * 10), b:Math.floor(Math.random() * 10), c:Math.floor(Math.random() * 10)})
}
console.log('\n------------Starting Data------------\n');
print(list);
list.sort(function(A, B){
    if(A.a > B.a){
        return 1;
    }else if(A.a === B.a){
        if(A.b > B.b){
            return 1;
        }else if(A.b === B.b){
            if(A.c >= B.c){
                return 1;
           }
        }
    }
    return -1;
});
console.log('\n------------Sorted Data------------\n');
print(list);
return;

list.sort(function(a, b){
    if(a.getDueDate() > b.getDueDate()){
        return 1;
    }else if(a.getDueDate() === b.getDueDate()){
        if(a.getDueTime() > b.getDueTime()){
            return 1;
        }else if(a.getDueTime() === b.getDueTime()){
            if(a.getTitle() > b.getTitle()){
                return 1;
            }
        }
    }
    return -1;
})