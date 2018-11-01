/**
 * Takes in an account number and returns the account matching it.
 * @param {obj} obj Should be {accountNumber: '123'}
 * @param {*} context This is whatever was passed into graphql context
 * @param {Object} args The arguments passed to GraphQL
 * @param {*} info AST of the incoming GraphQL query
 */
exports.clientsByID = function(obj, context, args, info) {
    return context.db.collection('clients').findOne({_id: obj._id})
}

//TODO: This needs limiter and paging added - current version is only for testing
// This only shows the list of clients a user has access to (Need to add the access control in token)
exports.clientsList = function(obj, context, args, info) {
    return context.db.collection('clients').find({clientId: {$in: obj.clientIDs},status: obj.status}).toArray()
}