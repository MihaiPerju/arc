exports.account = function(obj, context, args, info) {
    return context.db.collection('accounts').findOne({acctNum: obj.acctNum})
}

//TODO: This needs limiter and paging added - current version is only for testing
exports.accountList = function(obj, context, args, info) {
    return context.db.collection('accounts').find({facilityId: {$in: obj.facilityIds},state: obj.state}).toArray()
}