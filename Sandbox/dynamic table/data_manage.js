function initialize() {
  firebase.initializeApp(firebaseConfig);
}

function uploadData() {
  let db = firebase.firestore();
  let isMale = document.formData.gender.value === "male";
  let age = document.formData.age.value;
  let email = document.formData.email.value;
  let nickname = document.formData.nickname.value;
  let name = document.formData.usrName.value;

  db.collection("Users").add({
    usrName: name,
    usrAge: age,
    usrIsMale: isMale,
    usrEmail: email,
    usrNickname: nickname
  });
}

function getData() {
  initialize();
  let db = firebase.firestore();
  let table = document.getElementById("dataTable");

  let userRf = db.collection("Users").orderBy("usrName", "desc");
  let allUsers = userRf.get().then(snapshot => {
    snapshot.forEach(doc => {
      let docData = doc.data();
      let rows = table.getElementsByTagName("tr");
      let row = table.insertRow(rows.length);
      let tblName = row.insertCell(0);
      let tblAge = row.insertCell(1);
      let tblGender = row.insertCell(2);
      let tblEmail = row.insertCell(3);
      let tblNick = row.insertCell(4);

      tblName.innerHTML = docData.usrName;
      tblAge.innerHTML = docData.usrAge;
      tblGender.innerHTML = getGender(docData.usrIsMale);
      tblEmail.innerHTML = docData.usrEmail;
      tblNick.innerHTML = docData.usrNickname;
    });
  });
}

function getGender(isMale) {
  return isMale ? "Male" : "Femail";
}
