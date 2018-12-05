const facilityQueries = require('../../dataSources/arcc/facilities');

/**
 * Takes in an account number and returns the account matching it.
 * @param {obj} obj Should be {accountNumber: '123'}
 * @param {*} context This is whatever was passed into graphql context
 * @param {Object} args The arguments passed to GraphQL
 * @param {*} info AST of the incoming GraphQL query
 */
exports.getFacility = function(obj, context, args, info) {
    return facilityQueries.getFacilityByID(obj.id, context.db)
}

//TODO: This needs limiter and paging added - current version is only for testing
// This only shows the list of facilities a user has access to (Need to add the access control in token)
exports.facilityList = function(obj, context, args, info) {
    return facilityQueries.getAccountList(obj.facil)
}