let list = new Array();
let i = 0;
for(i = 0; i < 100; i++){
    list.push({a:Math.floor(Math.random() * 10), b:Math.floor(Math.random() * 10), c:Math.floor(Math.random() * 10)})
}
list.sort((a, b) => {
    if(a.a > b.a){
        return 1;
    }else if(a.a === b.a){
        if(a.b > b.b){
            return 1;
        }else if(a.b === b.b){
            if(a.c >= b.c){
                return 1;
           }
        }
    }
    return -1;
});
list.forEach(item => {
    console.log('a:',item.a, '\tb:', item.b, '\tc:', item.c);
})