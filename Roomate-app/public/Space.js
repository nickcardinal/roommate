class Space {
    constructor() {
        this.name;
        this.description;
        this.spaceID;
        this.mates = [];
        this.tasks = [];
    }

    setName(name) {
      this.name = name;
    }

    getName() {
      return this.name;
    }

    setDescription(description) {
      this.description = description;
    }

    getDescription() {
      return this.description;
    }

    setSpaceID(spaceID) {
      this.spaceID = spaceId;
    }

    getSpaceID() {
      return this.spaceID;
    }

    addMate(mate) {
      this.mates.push(mate);
    }

    getMates() {
      return this.mates;
    }

    addTask(task) {
      this.tasks.push(task);
    }

    getTasks() {
      return this.tasks;
    }
}
