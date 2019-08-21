// An attempt to pull tasks from Firebase
function pullTasksFromFirebase() {
  var spaceID = sessionStorage.getItem("Space");
  var spacedb = firebase.firestore().collection("Spaces").doc(spaceID);
  console.log("Space in session: " + spaceID);

  var tempTaskArray = new Array();

  let space = await spacedb.get();
  tempTaskArray = space.data().spcTasks;
  console.log("tempTaskArray: ");
  tempTaskArray.forEach(doc => {
    console.log(doc);
  })
}
