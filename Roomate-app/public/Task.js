class Task {
    constructor(taskId, spaceId) {
        this.taskCategories = new Array();
        this.title = '';
        this.time = new Date();
        this.complete = false;
        this.desc = '';
        this.assignedMembers = new Array();
        this.sid;
    }
}