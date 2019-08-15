function cout(){
    initialize();
    let database = firebase.firestore();
    createUser(sessionStorage.getItem(0), sessionStorage.getItem(1), sessionStorage.getItem(2), database);
}