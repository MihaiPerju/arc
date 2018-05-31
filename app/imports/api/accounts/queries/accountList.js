import Accounts from '../collection';

export default Accounts.createNamedQuery('accountList', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    acctNum: 1,
    facCode: 1,
    ptType: 1,
    ptName: 1,
    tickleDate: 1,
    dischrgDate: 1,
    collectedAmount: 1,
    fbDate: 1,
    acctBal: 1,
    finClass: 1,
    admitDate: 1,
    medNo: 1,
    insName: 1,
    insurances: 1,
    insName2: 1,
    insName3: 1,
    insCode: 1,
    insCode2: 1,
    insCode3: 1,
    insBal: 1,
    insBal2: 1,
    insBal3: 1,
    state: 1,
    substate: 1,
    facilityId: 1,
    facility: {
        name: 1,
        users: {
            profile: 1,
            roles: 1
        }
    },
    assigneeId: 1,
    assignee: {
        profile: {
            firstName: 1,
            lastName: 1
        },
        emails: 1
    },
    client: {
        clientName: 1
    },
    attachments: {
        _id: 1,
        path: 1,
        name: 1
    },
    actions: {
        reasonCode: 1,
        action: {
            title: 1
        },
        user:{
            profile:1
        },
        createdAt: 1,
        status: 1,
        type: 1,
        $options: {sort: { createdAt: -1 }}
    },
    metaData: 1,
    escalateReason: 1,
    workQueue: 1,
    tag: {
        name: 1
    }
});