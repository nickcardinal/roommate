
function spaceKeyInitialize() {
  initialize();
  //let spc = new Space();
  let spc = accessFirestoreSpace('pucXA6FNUDQE2FLCMsic');;
  spc.setTitle("My Space");
  spc.setID(1234456);
  document.getElementById('showName').innerHTML= spc.getTitle();
  document.getElementById('showID').innerHTML= spc.getID();
}
