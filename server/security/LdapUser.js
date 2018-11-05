const crypto = require('crypto');

exports = class LdapUser {
    constructor(user, db){
        this.collection = db.collection('ldapUsers');
        this.user = {
            groups: user.groups,
            phone:user.phone,
            fullName: user.name,
            email: user.mail,
            guid: user.guid
        }
    }

    /**
     * Updates the user in the DB w/ the current values in this class (e.g. this.name)
     * @param {Boolean} upsert Sets the mongo upsert command, default is false.
     * @returns {Promise} This returns a promise for the DB operation
     */
    updateUser(upsert = false) {
        // Remove _id for update
        const tmpUser = {...this.user};
        delete tmpUser._id;

        return this.collection.updateOne({_id: this.user._id}, tmpUser, { upsert });
    }

    /**
     * This creates the new user in the DB w/ the current values in this class (e.g. this.name)
     * @returns {Promise} Returns a promise for the DB opertion, Write Concern majority is enabled
     */
    createUser() {
        return this.collection.insertOne(this.user, {w: "majority"});
    }

    /**
     * Adds a session to the user in the DB
     * @param {Date} expires When does the session expire
     * @returns {String} The session ID used in auth flow (This is async, so really you get a promise)
     */
    async createSession(expires) {
        if(!expires instanceof Date)
            throw new Error("Expires must be a JavaScript date");

        const sessionId = crypto.randomBytes(32).toString('hex');

        //TODO: Validate resp
        const resp = await this.collection.updateOne(
            {_id: this._id},
            {
                $push: {
                    "sessions": {
                        $each: [{sessionId, expires}],
                        $slice: -5
                    },
                }
            },
            {w: "majority"}
        );
    
        return sessionId
    }
}