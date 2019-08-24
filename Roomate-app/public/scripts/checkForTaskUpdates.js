initialize();

let spaceID = sessionStorage.getItem("Space");
let mateID = sessionStorage.getItem("user");
let doc = firebase.firestore().collection("Tasks").where('tskSpaceID', '==', spaceID);

doc.onSnapshot(function(snapshot) {
  snapshot.docChanges().forEach(function(change) {
    if(change.type === "added") {
      console.log("New Task", change.doc.data());
      refreshTasks();
    }
    if(change.type === "modified") {
      console.log("Modified Task", change.doc.data());
      refreshTasks();
    }
    if(change.type === "removed") {
      console.log("Removed Task", change.doc.data());
      refreshTasks();
    }
  });
});

async function refreshTasks() {
  await syncData();
  resetTaskTable();
}
