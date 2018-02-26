import React from 'react';
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';

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