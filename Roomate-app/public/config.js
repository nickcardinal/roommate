function initialize() {
    firebase.initializeApp(firebaseConfig);
}
const firebaseConfig = {
    apiKey: "AIzaSyCmyzsBoBimz_LSIKGBVPqYb9-Ngq4aW38",
    authDomain: "roommate-a0823.firebaseapp.com",
    databaseURL: "https://roommate-a0823.firebaseio.com",
    projectId: "roommate-a0823",
    storageBucket: "roommate-a0823.appspot.com",
    messagingSenderId: "941174280385",
    appId: "1:941174280385:web:0ee7547beb6089b7"
};
function validate(){
    initialize();
    database = firebase.firestore();
    let query = database.collection('Mates').where('usrEmail', '==', sessionStorage.getItem(0)).get().then(snapshot =>{
        if(snapshot.empty){
            window.location.href = "./index.html";
        }else{
            return;
        }
    });
  }