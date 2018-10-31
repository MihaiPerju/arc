/**
 * Takes in an account number and returns the account matching it.
 * @param {obj} obj Should be {accountNumber: '123'}
 */
exports.account = function(obj, context, args, info) {
    return context.db.collection('accounts').findOne({acctNum: obj.acctNum})
}

/**
 * Takes in an account state and returns the accounts matching it.
 * @param {String} state
 */
exports.accountList = function(state) {
    return [{accountNumber: '123', accountBalance: 2.30}]
}