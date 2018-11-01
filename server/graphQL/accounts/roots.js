/**
 * Takes in an account number and returns the account matching it.
 * @param {obj} obj Should be {accountNumber: '123'}
 * @param {*} context This is whatever was passed into graphql context
 * @param {Object} args The arguments passed to GraphQL
 * @param {*} info AST of the incoming GraphQL query
 */
exports.account = function(obj, context, args, info) {
    return context.db.collection('accounts').findOne({acctNum: obj.acctNum})
}

//TODO: This needs limiter and paging added - current version is only for testing
exports.accountList = function(obj, context, args, info) {
    return context.db.collection('accounts').find({facilityId: {$in: obj.facilityIds},state: obj.state}).toArray()
}