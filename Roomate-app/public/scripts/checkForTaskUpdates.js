initialize();

let spaceID = sessionStorage.getItem("Space");
let mateID = sessionStorage.getItem("user");
let doc = firebase.firestore().collection("Spaces").where('spcMates', 'array-contains', mateID);

doc.onSnapshot(function(snapshot) {
  snapshot.docChanges().forEach(function(change) {
    if(change.type === "added") {
      console.log("New Space", change.doc.data());
    }
    if(change.type === "modified") {
      console.log("Modified Task", change.doc.data().spcTasks);
        refreshTasks();
    }
  });
});

async function refreshTasks() {
  await syncData();
  resetTaskTable();
}
