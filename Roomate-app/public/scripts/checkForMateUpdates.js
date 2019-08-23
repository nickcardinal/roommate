

//checks for firestore updates to mates and tasks
// function checkForFirestoreMateUpdates() {
//   let spaceID = sessionStorage.getItem("Space");
//   let mateID = sessionStorage.getItem('user');
//   let doc = firebase.firestore().collection("Spaces").doc(spaceID);
//
//   var unsub =
//          // [START listen_with_metadata]
//          firebase.firestore().collection("Spaces").doc(spaceID)
//              .onSnapshot({
//                  // Listen for document metadata changes
//                  includeMetadataChanges: true
//              }, function(doc) {
//                var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
//               console.log(source, " data: ", doc.data());
//              });
//          // [END listen_with_metadata]
//          //unsub();
// }

  validate();

  let spaceID = sessionStorage.getItem("Space");
  let mateID = sessionStorage.getItem('user');
  let doc = firebase.firestore().collection("Spaces").where('spcMates', 'array-contains', mateID);

  doc.onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if(change.type === "added") {
        console.log("New Mate", change.doc.data());
      }
      if(change.type === "modified") {
        console.log("Modified Mate", change.doc.data().spcMates);
        clearMatesTable();
        displayMates();
      }
    })
  })
