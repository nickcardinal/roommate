initialize();

let spaceID = sessionStorage.getItem("Space");
let mateID = sessionStorage.getItem("user");
let space = firebase.firestore().collection("Spaces").doc(spaceID);
let doc = firebase.firestore().collection("Mates").where('usrSpaces', 'array-contains', space);

doc.onSnapshot(function(snapshot) {
  snapshot.docChanges().forEach(function(change) {
    if(change.type === "added") {
      console.log("New Mate", change.doc.data());
    }
    if(change.type === "modified") {
      console.log("Modified Mate", change.doc.data());
    }
    if(change.type === "removed") {
      console.log("Removed Mate", change.doc.data());
    }
  });
  refreshMates();
});

async function refreshMates() {
  await loadSpaceFromFirestore();
  resetMateTable();
}
