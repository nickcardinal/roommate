function spaceKeyInitialize() {
  //Make sure the user is logged in, also sets up firebase (could make a parameter that would allow it not to if nessessary)
  validate();
  var space = new Space();
  space.setID(9876543);
  space.setName("My Space");

  document.getElementById('showName').innerHTML= space.getName();
  document.getElementById('showID').innerHTML= space.getID();
}
