class Space {
    constructor() {
        this.title;
        this.description;
        this.ID;
        this.mates = [];
        this.tasks = [];
    }

    //Title Functions
    setTitle(title) {
      this.title = title;
    }

    getTitle() {
      return this.title;
    }

    //Description Functions
    setDescription(description) {
      this.description = description;
    }

    getDescription() {
      return this.description;
    }

    //ID Functions
    setID(ID) {
      this.ID = ID;
    }

    getID() {
      return this.ID;
    }

    //Mate Array Functions
    addMate(mate) {
      this.mates.push(mate);
    }

    getMates() {
      return this.mates;
    }

    //Task Array Functions
    addTask(task) {
      this.tasks.push(task);
    }

    getTasks() {
      return this.tasks;
    }
}

function createFirestoreSpace() {
    let spacedb = firebase.firestore().collection("Spaces");

    //test space
    let currSpace = new Space();
    currSpace.setTitle("My Space");
    currSpace.setDescription("This is my new space");
    //currSpace.mates.push();

    let data = {
      spcTitle: currSpace.getTitle(),
      spcDescription: currSpace.getDescription(),
      spcMates: firebase.firestore.FieldValue.arrayUnion('/Mates/mnTsbYn8LSlug7JlYsxW')
    }

    spacedb.add(data);
}

function accessFirestoreSpace(ID) {
  var space = new Space();
  let spacedb = firebase.firestore().collection("Spaces").doc(ID);
  let getSpace = spacedb.get().then(doc => {
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
      space.setDescription(doc.data().spcDescription);
      space.setTitle(doc.data().spcTitle);
      space.setID(doc.id);
      return space;
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });
}

function reWriteFirestoreSpace(ID, space) {
  let spacedb = firebase.firestore().collection("Spaces");

  let data = {
    spcTitle: space.getTitle(),
    spcDescription: space.getDescription()
  }

  spacedb.doc(ID).set(data);
}
