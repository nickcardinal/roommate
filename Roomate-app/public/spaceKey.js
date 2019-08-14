function spaceKeyInitialize() {
  var space = new Space();
  space.setID(9876543);
  space.setName("My Space");

  document.getElementById('showName').innerHTML= space.getName();
  document.getElementById('showID').innerHTML= space.getID();
}
