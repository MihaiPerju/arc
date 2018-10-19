import Actions from "/imports/api/actions/collection";
import Tags from "/imports/api/tags/collection";

export default class FieldsGenerator {
    static getFields() {
        const actions = Actions.find().fetch();
        const actionOptions = actions.map((action) => {
            return {
                value: action._id,
                name: action.title
            }
        });

        const workQueues = Tags.find({}).fetch();
        const workQueueOptions = workQueues.map((workQueue) => {
            return {
                value: workQueue._id,
                name: workQueue.name
            }
        });
        
        return [{
                name: 'lastUserAction',
                operators: ['=', '!=', 'contains', 'startsWith', 'endsWith', '!!', '!'],
                label: 'Last Action',
                input: {
                    type: 'select',
                    options: actionOptions
                },
            },
            {
                name: 'ptType',
                operators: ['=', '!=', 'contains', 'startsWith', 'endsWith', '!!', '!'],
                label: 'Patient Type',
                input: {
                    type: 'text'
                },
            },
            {
                name: 'ptName',
                operators: ['=', '!=', 'contains', 'startsWith', 'endsWith', '!!', '!'],
                label: 'Patient Name',
                input: {
                    type: 'text'
                },
            },
            {
                name: 'dischrgDate',
                operators: ['=', '!=', '>', '>=', '<', '<=', '!!', '!'],
                label: 'Discharge Date',
                input: {
                    type: 'date'
                },
            },
            {
                name: 'fbDate',
                operators: ['=', '!=', '>', '>=', '<', '<='],
                label: 'Last Bill Date',
                input: {
                    type: 'date'
                },
            },
            {
                name: 'acctBal',
                operators: ['=', '!=', '>', '>=', '<', '<=', '!!', '!'],
                label: 'Account Balance',
                input: {
                    type: 'number'
                },
            },
            {
                name: 'finClass',
                operators: ['=', '!=', 'contains', 'startsWith', 'endsWith', '!!', '!'],
                label: 'Financial Class',
                input: {
                    type: 'text'
                },
            },
            {
                name: 'admitDate',
                operators: ['=', '!=', '>', '>=', '<', '<=', '!!', '!'],
                label: 'Admit Date',
                input: {
                    type: 'date'
                },
            },
            {
                name: 'state',
                operators: ['=', '!=', 'contains', 'startsWith', 'endsWith', '!!', '!'],
                label: 'State',
                input: {
                    type: 'text'
                },
            },
            {
                name: 'substate',
                operators: ['=', '!=', 'contains', 'startsWith', 'endsWith', '!!', '!'],
                label: 'Substate',
                input: {
                    type: 'text'
                },
            },
            {
                name: 'activeInsCode',
                operators: ['=', '!=', 'contains', 'startsWith', 'endsWith', '!!', '!'],
                label: 'Active Insurance Code',
                input: {
                    type: 'text'
                },
            },
            {
                name: 'tickleDate',
                operators: ['=', '!=', '>', '>=', '<', '<=', '!!', '!'],
                label: 'Tickle Date',
                input: {
                    type: 'date'
                },
            },
            {
                name: 'tickleReason',
                operators: ['=', '!=', 'contains', 'startsWith', 'endsWith', '!!', '!'],
                label: 'Tickle Reason',
                input: {
                    type: 'text'
                },
            },
            {
                name: 'workQueueId',
                operators: ['=', '!=', 'contains', 'startsWith', 'endsWith', '!!', '!'],
                label: 'Work Queue',
                input: {
                    type: 'select',
                    options: workQueueOptions
                },
            },
            {
                name: 'acctNum',
                operators: ['=', '!=', 'contains', 'startsWith', 'endsWith', '!!', '!'],
                label: 'Account Number',
                input: {
                    type: 'text'
                },
            },
            {
                name: 'facCode',
                operators: ['=', '!=', 'contains', 'startsWith', 'endsWith', '!!', '!'],
                label: 'Facility Code',
                input: {
                    type: 'text'
                },
            },
            {
                name: 'medNo',
                operators: ['=', '!=', '>', '>=', '<', '<=', '!!', '!'],
                label: 'Medical Number',
                input: {
                    type: 'number'
                },
            },
        ];
    }
}