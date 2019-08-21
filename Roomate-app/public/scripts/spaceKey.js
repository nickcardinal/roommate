
function spaceKeyInitialize() {
  validate();
  accessFirestoreSpace(sessionStorage.getItem('Space'), spaceKeyShowElements);
}

function spaceKeyShowElements(spc) {
  console.log("Space Title: " + spc.getTitle());
  console.log("Space Description: " + spc.getDescription());
  console.log("Space ID: " + spc.getID());

  document.getElementById('showName').innerHTML= spc.getTitle();
  document.getElementById('showDescription').innerHTML= spc.getDescription();
  document.getElementById('showID').innerHTML= spc.getID();
}
