const { getFacilityByID } = require('./facilities');

class Account {
    constructor(acctObj, db) {
        this.db = db;

        // Mutate some names to avoid issues
        this._facilityId = acctObj.facilityId;
        delete acctObj.facilityId;

        // Assign all the keys to obj, so we don't need to write
        //   a return function for each one.
        Object.assign(this, acctObj)
    }

    get facilityId() {
        return getFacilityByID(this._facilityId, this.db)
    }
}

/**
 * Gets one account based on it's _id in Mongo collection
 * @param {String} id The _id of the obj in Mongo
 * @param {Object} db The MongoDB connection used to get the record
 */
exports.getAccountByID = (id, db) => db.collection('accounts').findOne({_id: id})

/**
 * Gets one account based on the Account Number
 * @param {String} acctNum The acctNum of the obj in Mongo
 * @param {Object} db The MongoDB connection used to get the record
 * @returns {Account} An account object w/ links to other collections
*/
exports.getByAcctNum = function(acctNum, db) {
    return db.collection('accounts').findOne({acctNum: acctNum})
        .then(data => new Account(data, db))
}

/**
 * Gets a list of accounts based on what facilities are passed in
 * @param {Array} facilityIDs An array of facility IDs to look in for accts
 * @param {Object} db The MongoDB connection used to get the record
*/
exports.getAccountList = function(facilityIDs, state, db) {
    return db.collection('accounts').find({facilityId: {$in: facilityIDs}, state: state}).toArray()
        .then(data => data.map(account => new Account(account, db)))
}