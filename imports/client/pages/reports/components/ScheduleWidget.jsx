import React from 'react';
import {AutoForm, ErrorField} from 'uniforms-semantic';
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import {Divider, Button, Segment} from 'semantic-ui-react'
import SimpleSchema from 'simpl-schema';
import ReportsEnum from '/imports/api/schedules/enums/reports';
import Notifier from '/imports/client/lib/Notifier';

export default class ScheduleWidget extends React.Component {
    constructor() {
        super();
    }

    onSubmit(data) {
        const {model} = this.props;
        const {reportId} = this.props;
        if (!model) {
            data.reportId = reportId;
            Meteor.call("schedule.create", data, (err) => {
                if (!err) {
                    Notifier.success("Schedule created!");
                    this.props.onCancelSchedule();
                } else {
                    Notifier.error(err.reason);
                }
            })
        } else {
            model.reportId = reportId;
            Meteor.call('report.sendNow', model, (err) => {
                if (!err) {
                    Notifier.success("Emails sent!");
                } else {
                    Notifier.error(err.reason);
                }
            })
        }
    }

    onDeleteSchedule(_id) {
        if (this.props.model) {
            Meteor.call('schedule.delete', _id, (err) => {
                if (!err) {
                    Notifier.success("Schedule removed!");
                } else
                    Notifier.error(err.reason);
            })
        } else {
            this.props.onCancelSchedule();
        }
    }

    render() {
        const {users, model} = this.props;
        return (
            <Segment>
                <Button
                    negative
                    attached='top'
                    content={model ? 'Delete' : 'Cancel'}
                    onClick={this.onDeleteSchedule.bind(this, model && model._id)}
                />
                <AutoForm model={model} schema={schema} onSubmit={this.onSubmit.bind(this)}>

                    <SelectMulti name="frequency" options={ReportsEnum.frequency}/>
                    <ErrorField name="frequency"/>

                    <SelectMulti name="userIds" options={users}/>
                    <ErrorField name="userIds"/>
                    <Divider/>

                    <Button fluid primary type="submit">
                        {
                            model ?
                                'Send now' :
                                'Create Schedule'
                        }
                    </Button>
                </AutoForm>
            </Segment>
        )
    }
}

const schema = new SimpleSchema({
    userIds: {
        type: Array,
        label: 'User Ids'
    },
    'userIds.$': {
        type: String
    },
    frequency: {
        type: Array,
        label: 'Frequency'
    },
    'frequency.$': {
        type: String
    }
});