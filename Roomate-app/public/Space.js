class Space {
    constructor() {
        this.name;
        this.description;
        this.ID;
        this.mates = [];
        this.tasks = [];
    }

    //Name Functions
    setName(name) {
      this.name = name;
    }

    getName() {
      return this.name;
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
