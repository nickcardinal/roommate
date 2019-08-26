class flyweight{
    constructor(database){
        this.spaces = new Array();
        this.tasks = new Array();
        this.mates = new Array();
        this.db = database;
        this.init();
        //Uses objects for JSON purposes, could be modified to use classes but would have to make classes on load.
    }
    init(){//pulls from session storage
        if(sessionStorage.getItem('flySpaces') !== null){
            this.spaces = JSON.parse(sessionStorage.getItem('flySpaces'));
        }
        if(sessionStorage.getItem('flyTasks') !== null){
            this.tasks = JSON.parse(sessionStorage.getItem('flyTasks'));
        }
        if(sessionStorage.getItem('flyMates') !== null){
            this.mates = JSON.parse(sessionStorage.getItem('flyMates'));
        }
    }
    save(){//saves to session storage
        sessionStorage.setItem('flySpaces', JSON.stringify(this.spaces));
        sessionStorage.setItem('flyTasks', JSON.stringify(this.tasks));
        sessionStorage.setItem('flyMates', JSON.stringify(this.mates));
    }
    async forcePull(docId, collection){//forces an update pull from Firestore
        let doc = await this.db.collection(collection).doc(docId).get();
        if(collection === 'Spaces'){
            doc = this.getSpace(doc);
            this.insert(this.spaces, doc, docId);
        }else if(collection === 'Tasks'){
            doc = this.getTask(doc);
            this.insert(this.tasks, doc, docId);
        }else if(collection === 'Mates'){
            doc = this.getMate(doc);
            this.insert(this.mates, doc, docId);
        }
        save();
        return doc;
    }
    async forcePush(docId, collection, doc){//forces an upload to firestore
        //case for no doc given, doc already been pushed to the flyweight
        if(doc === undefined){
            doc = await this.pull(docId, collection);
        }else{
            await this.push(docId, collection, doc);
        }
        await this.db.collection(collection).doc(docId).update(doc);
    }

    async pull(docId, collection){
        let doc;
        if(collection === 'Spaces'){
            doc = this.getDoc(this.spaces, docId);
        }else if(collection === 'Tasks'){
            doc = this.getDoc(this.tasks, docId);
        }else if(collection === 'Mates'){
            doc = this.getDoc(this.mates, docId);
        }else{
            throw('Unexpected collection: ' + collection + ' was not one of "Spaces", "Tasks", "Mates"');
        }
        if(doc === null){
            doc = await this.forcePull(docId, collection);
        }
        return doc;
    }

    async push(docId, collection, doc){
        if(collection === 'Spaces'){
            this.insert(this.spaces, doc, docId);
        }else if(collection === 'Tasks'){
            this.insert(this.tasks, doc, docId);
        }else if(collection === 'Mates'){
            this.insert(this.mates, doc, docId);
        }else{
            throw('Unexpected collection: ' + collection + ' was not one of "Spaces", "Tasks", "Mates"');
        }
        save();
    }

    async forcePushAll(){
        await this.spaces.forEach(async space => {
            await db.collection('Spaces').doc(space.id).update(space.data);
        });
        await this.tasks.forEach(async task => {
            await db.collection('Tasks').doc(task.id).update(task.data);
        });
        await this.mates.forEach(async mate => {
            await db.collection('Mates').doc(mate.id).update(mate.data);
        });
    }

    //'Private' helper functions past this poing

    getDoc(arr, docId){
        for(let i = 0; i < arr.length; i++){
            console.log(arr[i].id === docId);
            if(arr[i].id === docId){
                return arr[i].data;
            }
        }
        return null;
    }
    insert(arr, doc, docId){
        arr.forEach(map => {
            if(docId === map.id){
                map.data = doc;
                return;
            }
        });
        arr.push(this.formMap(doc, docId));
    }
    formMap(doc, id){
        return {data:doc, id:id};
    }
    getMate(fireMate){
        let data = fireMate.data();
        let usrSpaces = new Array();
        data.usrSpaces.forEach(space => {
            usrSpaces.push(space.id);
        });
        //when we start using this: clear database then delete the 3 lines above
        return{
            usrEmail:data.usrEmail,
            usrName:data.usrName,
            usrNickname:data.usrNickname,
            usrPhotoUrl:data.usrPhotoUrl,
            usrSpaces:usrSpaces
        };
    }
    getSpace(fireSpace){
        let data = fireSpace.data();
        return{
            spcTitle:data.spcTitle,
            spcDescription:data.spcDescription,
            spcMates:data.spcMates,
            spcTasks:data.spcTasks,
        };
    }
    getTask(fireTask){
        let data = fireTask.data();
        return {
            tskAssignedMateID:data.tskAssignedMateID,
            tskFavorMateID:data.tskFavorMateID,
            tskSpaceID:data.tskSpaceID,
            tskDescription:data.tskDescription,
            tskTitle:data.tskTitle,
            tskDueDate:data.tskDueDate,
            tskDueTime:data.tskDueTime,
            tskIsComplete:data.tskIsComplete,
            tskIsRecurring:data.tskIsRecurring,
            tskRecurringPeriod:data.tskRecurringPeriod,
        };
    }
}