initialize();

let spaceID = sessionStorage.getItem("Space");
let mateID = sessionStorage.getItem("user");
let space = firebase.firestore().collection("Spaces").doc(spaceID);
let doc = firebase.firestore().collection("Mates").where('usrSpaces', 'array-contains', space);
console.log(doc);

doc.onSnapshot(function(snapshot) {
  snapshot.docChanges().forEach(function(change) {
    if(change.type === "added") {
      console.log("New Mate", change.doc.data());
      refreshMates();
    }
    if(change.type === "modified") {
      console.log("Modified Mates", change.doc.data());
      refreshMates();
    }
    if(change.type === "removed") {
      console.log("Removed Mate", change.doc.data());
      refreshMates();
    }
  });
});

async function refreshMates() {
  await syncData();
  resetMateTable();
}
