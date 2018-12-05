const { getClientByID } = require('./clients');

class Facility {
    constructor(facObj, db) {
        this.db = db;

        // Mutate some names to avoid issues
        this._clientId = facObj.clientId;
        delete facObj.clientId;

        // Assign all the keys to obj, so we don't need to write
        //   a return function for each one.
        Object.assign(this, facObj)
    }

    get clientId() {
        return getClientByID(this._clientId, this.db)
    }
}

/**
 * Gets one facility based on it's _id in Mongo collection
 * @param {String} id The _id of the obj in Mongo
 * @param {Object} db The MongoDB connection used to get the record
 */
exports.getFacilityByID = function(id, db){
    return db.collection('facilities').findOne({_id: id})
        .then(data => new Facility(data, db))
}