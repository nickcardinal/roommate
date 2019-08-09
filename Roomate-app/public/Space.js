class Space {
    constructor(spaceId) {
        this.tasks = new Array();
        this.name = 'My space';
        this.taskCategories = new Array();
        this.members = new array();
        this.sid = spaceId;
        //data member initialized
        const spaceRef = db.collection("LivingGroup").doc(sid);
        let getDoc = spaceRef.get();
    }
    pushToFirestore() {

    }
}