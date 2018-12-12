const isDate = require('date-fns/is_date');
const subDays = require('date-fns/sub_days');

/** Class that can calculate statistics for a client */
class ClientStatistics {
    /**
     * Creates a client and sets DB connection
     * @param {MongoClient} db A MongoDB client w/ DB selected
     * @param {Function} dbStatusCheck The function to check the status of the db
     * @param {String} clientId The clientId of this client
     */
    constructor(db, dbStatusCheck, clientId) {
        dbStatusCheck()
        this._db = db;
        this._clientId = clientId;
        this._isReady = this.db && this._clientId;
        this._offlineMessage = '';
        this._dbStatusCheck = typeof dbStatusCheck === 'function' ? dbStatusCheck : () => false;
    }

    set clientId(clientId) {
        const isInvalid = ClientStatistics.verifyClientId(clientId)
        if(isInvalid) {
            this.isReady(false);
            this.offlineMessage('Invalid clientId');
            this.clientId(null);
            return;
        }
        
        this._clientId = clientId;
    };

    get clientId() {
        return this._clientId;
    };

    get isReady() {
        if(!this.dbStatusCheck()) {
            this._isReady = false;
            this.offlineMessage = 'DB is offline'
        };

        return this._isReady;
    };

    set isReady(ready) {
        this._isReady = ready;
        this.offlineMessage = ready ? '' : this.offlineMessage;
    };

    set db(mongoClient) {
        this._db = mongoClient;
        this.isReady(true);
    };

    get db() {
        return this._db;
    };

    set dbStatusCheck(fn) {
        this._dbStatusCheck = typeof fn === 'function' ? fn : () => false;
    };

    get dbStatusCheck() {
        return this._dbStatusCheck;
    };

    set offlineMessage(message) {
        this._offlineMessage = typeof message === 'string' ? message : 'An invalid offline message was passed.';
    };

    get offlineMessage() {
        return this._offlineMessage;
    };

    /**
     * Checks if this is a clientId, if it is not an error is returned.
     * @param {String} clientId Verify this variable is a clientId
     */
    static verifyClientId(clientId) {
        if(!clientId || typeof clientId !== 'string')
            return 'A valid clientId string is required';
    };

    /**
     * Checks if this is a date or an array of dates, if it is not an error is returned.
     * @param {Date} startDate Verify this variable is a date
     * @returns {String} If invalid a message string is returned, if valid nothing is returned.
     */
    static verifyDate(startDate) {
        if(!isDate(startDate)) {

            // Check if this is an array of dates
            if(!Array.isArray(startDate))
                return 'A valid date object is required.';

            // Validate every date in the array
            const count = startDate.length;
            for(let i = 0; i < count; i++) {
                if(!isDate(startDate[i]))
                    return 'A valid date object is required for every item in the array.';
            };
        };
    };

    /**
     * Checks if this is a statistics object, if it is not an error is returned.
     * @param {Object} statistics Verify this variable is a statistics object
     */
    static verifyStatistics(statistics) {
        //TODO: Validate schmea
        if(!statistics || typeof statistics !== 'object')
            return 'A valid statistics obj is required.';
    };

    // ! Below will most likely be moved into an inherited class later on

    /**
     * Runs all the statistic functions for a client
     * @param {Date} startDate The date to start statistics from (Typically 1 month old)
     * @returns {Promise} Promise that resolves to a statistics or rejects with an error
     */
    computeClientStats(startDate) {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.totalInventory(),
                this.countPlacementDate(startDate),
                this.accountsResolved(startDate),
                this.countAgedPlacements(subDays(new Date(), 180)),
                this.pushedToCall(startDate),
                this.escalationsDue(),
                this.escalationsCreated(startDate),
                this.escalationsResolved(startDate),
                this.unassignedAccounts()
            ])
                .then(resp => {
                    resolve({
                        totalInventory: resp[0],
                        newAccounts: resp[1],
                        accountsResolved: resp[2],
                        over180: resp[3],
                        callActions: resp[4],
                        assignedAccounts: resp[0] - resp[8],
                        escalations: {
                            totalDue: resp[5],
                            created: resp[6],
                            resolved: resp[7]
                        }
                    });
                })
                .catch(err => reject(err));
        });
    }

    /**
     * Update a client in the DB with new statistics
     * @param {Object} statistics Object with all statistics
     * @returns {Promise} Resolves to the update results
     */
    async updateClientStats(statistics) {
        const isInvalid = ClientStatistics.verifyStatistics(statistics);
        if(isInvalid)
            throw new Error(isInvalid)

        if(!this.isReady)
            throw new Error(this.offlineMessage);

        return await this.db.collection('clients').updateOne(
            {
                _id: this._clientId
            },
            {
                $set: {
                    statistics
                }
            }
        )
    };

    /**
     * Queries for a count of accounts not in archived state
     * @returns {Promise} MongoDB driver promise to
     */
    async totalInventory() {
        if(!this.isReady)
            throw new Error(this.offlineMessage);

        return await this.db.collection('accounts').find({
            clientId: this._clientId,
            state: {
                $ne: 'Archived'
            }
        }).count();
    };

    /**
     * Queries for a count of new accounts in a date range
     * @param {Date} startDate  The date to start the query from
     * @param {Date} endDate OPTIONAL: If supplied this is the end date in the query, if not defaults to now
     * @returns {Promise} MongoDB driver promise to
     */
    async countPlacementDate(startDate, endDate = new Date()) {
        const isInvalid = ClientStatistics.verifyDate([startDate, endDate]);
        if(isInvalid)
            throw new Error(isInvalid)

        if(!this.isReady)
            throw new Error(this.offlineMessage);

        return await this.db.collection('accounts').find({
            clientId: this._clientId,
            placementDate: {
                $gte: startDate,
                $lt: endDate
            }
        }).count();
    };

    /**
     * Queries for a count of accounts resolved in date range
     * @param {Date} startDate The date to start the query from
     * @param {Date} endDate OPTIONAL: If supplied this is the end date in the query, if not defaults to now
     * @returns {Promise} MongoDB driver promise to
     */
    async accountsResolved(startDate, endDate = new Date()) {
        const isInvalid = ClientStatistics.verifyDate([startDate, endDate]);
        if(isInvalid)
            throw new Error(isInvalid)

        if(!this.isReady)
            throw new Error(this.offlineMessage);

        return await this.db.collection('account_actions').find({
            type: 'userAction',
            clientId: this._clientId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            },
            newState: 'Hold'
        }).count();
    };

    /**
     * Queries for a count of accounts forwarded for a call in a specific date range
     * @param {Date} startDate The date to start the query from
     * @param {Date} endDate OPTIONAL: If supplied this is the end date in the query, if not defaults to now
     * @returns {Promise} MongoDB driver promise to
     */
    async pushedToCall(startDate, endDate = new Date()) {
        const isInvalid = ClientStatistics.verifyDate([startDate, endDate]);
        if(isInvalid)
            throw new Error(isInvalid)

        if(!this.isReady)
            throw new Error(this.offlineMessage);

        return await this.db.collection('account_actions').find({
            type: 'userAction',
            clientId: this._clientId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            },
            newSubstate: 'Call'
        }).count();
    };

    /**
     * Queries for a accounts that have placement date matching or older than a specified date
     * @param {Date} startDate The date to start the query from (Looks for this or older)
     * @returns {Promise} MongoDB driver promise to
     */
    async countAgedPlacements(startDate) {
        const isInvalid = ClientStatistics.verifyDate(startDate);
        if(isInvalid)
            throw new Error(isInvalid)

        if(!this.isReady)
            throw new Error(this.offlineMessage);

        return await this.db.collection('accounts').find({
            clientId: this._clientId,
            placementDate: {
                $lte: startDate
            },
            state: {
                $ne: 'Archived'
            }
        }).count();
    };

    /**
     * Queries for a count of escalations due for a client
     * @returns {Promise} Promise resolves to an object with total, completed, and pending escalations.
     */
    async escalationsDue() {
        if(!this.isReady)
            throw new Error(this.offlineMessage);

        return await this.db.collection('escalations').find({
            clientId: this._clientId,
            resolved: false
        }).count();
    };

    /**
     * Queries for a count of escalations created in a date range
     * @param {Date} startDate The date to start the query from (Looks for this or older)
     * @param {Date} endDate OPTIONAL: If supplied this is the end date in the query, if not defaults to now
     * @returns {Promise} Promise resolves to an object with total, completed, and pending escalations.
     */
    async escalationsCreated(startDate, endDate = new Date()) {
        const isInvalid = ClientStatistics.verifyDate([startDate, endDate]);
        if(isInvalid)
            throw new Error(isInvalid)

        if(!this.isReady)
            throw new Error(this.offlineMessage);

        return await this.db.collection('escalations').find({
            clientId: this._clientId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        }).count();
    };

    /**
     * Queries for a count of escalations resolved in a date range
     * @param {Date} startDate The date to start the query from (Looks for this or older)
     * @param {Date} endDate OPTIONAL: If supplied this is the end date in the query, if not defaults to now
     * @returns {Promise} Promise resolves to an object with total, completed, and pending escalations.
     */
    async escalationsResolved(startDate, endDate = new Date()) {
        const isInvalid = ClientStatistics.verifyDate([startDate, endDate]);
        if(isInvalid)
            throw new Error(isInvalid)

        if(!this.isReady)
            throw new Error(this.offlineMessage);

        return this.db.collection('escalations').find({
            clientId: this._clientId,
            resolved: true,
            resolvedAt: {
                $gte: startDate,
                $lt: endDate
            }
        }).count();
    };

    /**
     * Queries for a count of current unassigned accounts
     * @returns {Promise} Promise resolves to an object with total, completed, and pending escalations.
     */
    async unassignedAccounts() {
        if(!this.isReady)
            throw new Error(this.offlineMessage);

        return this.db.collection('accounts').find({
            clientId: this._clientId,
            state: 'Active',
            assigneeId: null,
            workQueueId: null
        }).count();
    };
}

exports.ClientStatistics = ClientStatistics;