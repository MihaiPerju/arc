const isDate = require('date-fns/is_date');
const subDays = require('date-fns/sub_days');

class StatisticsWorker {
    constructor(db) {
        this.db = db;
    }

    /**
     * Checks if this is a clientId, if it not an error is thrown.
     * @param {*} clientId Verify this variable is a clientId
     */
    static verifyClientId(clientId) {
        if(!clientId || typeof clientId !== 'string')
            throw new Error('A valid clientId string is required.');
    };

    /**
     * Checks if this is a date or an array of dates, if it not an error is thrown.
     * @param {*} startDate Verify this variable is a date
     */
    static verifyDate(startDate) {
        if(!isDate(startDate)) {

            // Check if this is an array of dates
            if(!Array.isArray(startDate))
                throw new Error('A valid date object is required.');

            // Validate every date in the array
            startDate.forEach(date => {
                if(!isDate(date))
                    throw new Error('A valid date object is required.');
            })
        }
    };

    /**
     * Checks if this is a statistics object, if it not an error is thrown.
     * @param {*} statistics Verify this variable is a statistics object
     */
    static verifyStatistics(statistics) {
        if(!statistics || typeof statistics !== 'object')
            throw new Error('A valid statistics obj is required.');
    };

    /**
     * Runs all the statistic functions for a client
     * @param {String} clientId _id of the client in the DB
     * @param {Date} startDate The date to start statistics from (Typically 1 month old)
     * @returns {Promise} Promise that resolves to a statistics or rejects with an error
     */
    computeClientStats(clientId, startDate) {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.totalInventory(clientId),
                this.countPlacementDate(clientId, startDate),
                this.accountsResolved(clientId, startDate),
                this.countAgedPlacements(clientId, subDays(new Date(), 180)),
                this.pushedToCall(clientId, startDate),
                this.escalationsDue(clientId),
                this.escalationsCreated(clientId, startDate),
                this.escalationsResolved(clientId, startDate)
            ])
                .then(resp => {
                    resolve({
                        totalInventory: resp[0],
                        newAccounts: resp[1],
                        accountsResolved: resp[2],
                        over180: resp[3],
                        callActions: resp[4],
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
     * @param {String} clientId _id of the object in the DB
     * @param {Object} statistics Object with all statistics
     */
    updateClientStats(clientId, statistics) {
        StatisticsWorker.verifyClientId(clientId);
        StatisticsWorker.verifyStatistics(verifyStatistics);

        this.db.collection('clients').updateOne(
            {
                clientId
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
     * @param {String} clientId The _id of the client in the DB
     * @returns {Promise} MongoDB driver promise to
     */
    totalInventory(clientId) {
        StatisticsWorker.verifyClientId(clientId);

        return this.db.collection('accounts').find({
            clientId,
            state: {
                $ne: 'Archived'
            }
        }).count();
    };

    /**
     * Queries for a count of new accounts in a date range
     * @param {String} clientId The _id of the client in the DB
     * @param {Date} startDate  The date to start the query from
     * @param {Date} endDate OPTIONAL: If supplied this is the end date in the query, if not defaults to now
     * @returns {Promise} MongoDB driver promise to
     */
    countPlacementDate(clientId, startDate, endDate = new Date()) {
        StatisticsWorker.verifyClientId(clientId);
        StatisticsWorker.verifyDate([startDate, endDate]);

        return this.db.collection('accounts').find({
            clientId,
            placementDate: {
                $gte: startDate,
                $lt: endDate
            }
        }).count();
    };

    /**
     * Queries for a count of accounts resolved in date range
     * @param {String} clientId The _id of the client in the DB
     * @param {Date} startDate The date to start the query from
     * @param {Date} endDate OPTIONAL: If supplied this is the end date in the query, if not defaults to now
     * @returns {Promise} MongoDB driver promise to
     */
    accountsResolved(clientId, startDate, endDate = new Date()) {
        StatisticsWorker.verifyClientId(clientId);
        StatisticsWorker.verifyDate([startDate, endDate]);

        return this.db.collection('account_actions').find({
            type: 'userAction',
            clientId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            },
            newState: 'Hold'
        }).count();
    };

    /**
     * Queries for a count of accounts forwarded for a call in a specific date range
     * @param {String} clientId The _id of the client in the DB
     * @param {Date} startDate The date to start the query from
     * @param {Date} endDate OPTIONAL: If supplied this is the end date in the query, if not defaults to now
     * @returns {Promise} MongoDB driver promise to
     */
    pushedToCall(clientId, startDate, endDate = new Date()) {
        StatisticsWorker.verifyClientId(clientId);
        StatisticsWorker.verifyDate([startDate, endDate]);

        return this.db.collection('account_actions').find({
            type: 'userAction',
            clientId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            },
            newSubstate: 'Call'
        }).count();
    };

    /**
     * Queries for a accounts that have placement date matching or older than a specified date
     * @param {String} clientId The _id of the client in the DB
     * @param {Date} startDate The date to start the query from (Looks for this or older)
     * @returns {Promise} MongoDB driver promise to
     */
    countAgedPlacements(clientId, startDate) {
        StatisticsWorker.verifyClientId(clientId);
        StatisticsWorker.verifyDate(startDate);

        return this.db.collection('accounts').find({
            clientId,
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
     * @param {String} clientId The _id of the client in the DB
     * @returns {Promise} Promise resolves to an object with total, completed, and pending escalations.
     */
    escalationsDue(clientId) {
        StatisticsWorker.verifyClientId(clientId);

        return this.db.collection('escalations').find({
            clientId,
            resolved: false
        }).count();
    };

    /**
     * Queries for a count of escalations created in a date range
     * @param {String} clientId The _id of the client in the DB
     * @param {Date} startDate The date to start the query from (Looks for this or older)
     * @param {Date} endDate OPTIONAL: If supplied this is the end date in the query, if not defaults to now
     * @returns {Promise} Promise resolves to an object with total, completed, and pending escalations.
     */
    escalationsCreated(clientId, startDate, endDate = new Date()) {
        StatisticsWorker.verifyClientId(clientId);
        StatisticsWorker.verifyDate([startDate, endDate]);

        return this.db.collection('escalations').find({
            clientId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        }).count();
    };

    /**
     * Queries for a count of escalations resolved in a date range
     * @param {String} clientId The _id of the client in the DB
     * @param {Date} startDate The date to start the query from (Looks for this or older)
     * @param {Date} endDate OPTIONAL: If supplied this is the end date in the query, if not defaults to now
     * @returns {Promise} Promise resolves to an object with total, completed, and pending escalations.
     */
    escalationsResolved(clientId, startDate, endDate = new Date()) {
        StatisticsWorker.verifyClientId(clientId);
        StatisticsWorker.verifyDate([startDate, endDate]);

        return this.db.collection('escalations').find({
            clientId,
            resolved: true,
            resolvedAt: {
                $gte: startDate,
                $lt: endDate
            }
        }).count();
    };
}


// ! Testing only
const { connectToMongo } = require('./dbSetup');
connectToMongo()
    .then(client => {
        if(!client)
            process.exit(0);

        const db = client.db('arcc');
        const SW = new StatisticsWorker(db);

        SW.computeClientStats('t6FYCP4hNiMaD5Xnb', new Date('11/01/2018'))
            .then(data => {
                console.log(data)
                //SW.updateClientStats('t6FYCP4hNiMaD5Xnb', data)
            })
            .catch(err => console.error(err))
    })