const accountQueries = require('../../dataSources/arcc/accounts');

/**
 * Takes in an account number and returns the account matching it.
 * @param {obj} obj Should be {accountNumber: '123'}
 * @param {*} context This is whatever was passed into graphql context
 * @param {Object} args The arguments passed to GraphQL
 * @param {*} info AST of the incoming GraphQL query
 */
exports.getAccount = function(obj, context, args, info) {
    return accountQueries.getByAcctNum(obj.acctNum, context.db);
}

//TODO: This needs limiter and paging added - current version is only for testing
exports.accountList = function(obj, context, args, info) {
    return accountQueries.getAccountList(obj.facilityIds, obj.state, context.db)
}