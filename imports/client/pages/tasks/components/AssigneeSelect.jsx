import React from 'react';
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import RolesEnum from '/imports/api/users/enums/roles';

export default class AssigneeSelect extends React.Component {
    constructor() {
        super();
    }

    onChange(key, value) {
        const {taskId} = this.props;
        Meteor.call('task.assignee_change', {taskId, value}, (err) => {
            if (!err) {
                Notifier.success('Assignee changed!');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        const {options} = this.props;
        const roles = Meteor.user().roles;

        if (_.contains([RolesEnum.REP, RolesEnum.MANAGER], roles[0])) {
            return (<div></div>);
        }

        return (
            <div>
                <AutoForm schema={schema}
                          onChange={this.onChange.bind(this)}>
                    <AutoField name="assigneeId" options={options}/>
                    <ErrorField name='assigneeId'/>
                </AutoForm>
            </div>
        )
    }
}

const schema = new SimpleSchema({
    assigneeId: {
        label: 'Assign task to user: ',
        type: String
    }
});