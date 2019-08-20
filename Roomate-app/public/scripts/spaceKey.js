
function spaceKeyInitialize() {
  validate();
  accessFirestoreSpace(sessionStorage.getItem('Space'), spaceKeyShowElements);
}

function spaceKeyShowElements(spc) {
    document.getElementById('showName').innerHTML= spc.getTitle();
    document.getElementById('showDescription').innerHTML= spc.getDescription();
    document.getElementById('showID').innerHTML= spc.getID();
}
