class Client {
    constructor(clientObj, db) {
        this.db = db;

        // Mutate some names to avoid issues
        this._managerIds = clientObj.managerIds;
        delete clientObj.managerIds;

        // Assign all the keys to obj, so we don't need to write
        //   a return function for each one.
        Object.assign(this, clientObj)
    }

    get managerIds() {
        return this._managerIds;
        // TODOreturn getFacilityByID(this._clientId, this.db)
    }
}

/**
 * Gets one client based on it's _id in Mongo collection
 * @param {String} id The _id of the obj in Mongo
 * @param {Object} db The MongoDB connection used to get the record
 */
exports.getClientByID = function(id, db){
    return db.collection('clients').findOne({_id: id})
        .then(data => new Client(data, db))
}