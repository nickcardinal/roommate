
function spaceKeyInitialize() {
  initialize();
  accessFirestoreSpace('0yAZm9Ny0Fka6TGI7PZr', spaceKeyShowElements);
}

function spaceKeyShowElements(spc) {
    document.getElementById('showName').innerHTML= spc.getTitle();
    document.getElementById('showDescription').innerHTML= spc.getDescription();
    document.getElementById('showID').innerHTML= spc.getID();
}
