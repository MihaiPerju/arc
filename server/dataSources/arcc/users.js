/**
 * Gets one user based on it's _id in Mongo collection
 * @param {String} id The _id of the obj in Mongo
 * @param {Object} db The MongoDB connection used to get the record
 */
exports.getUserByID = function(id, db){
    return db.collection('ldapUsers').findOne({_id: id})
        .then(data => new User(data, db))
}