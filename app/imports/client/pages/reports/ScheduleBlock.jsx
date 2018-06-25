import React, {Component} from 'react';
import Notifier from "../../lib/Notifier";
import clientsQuery from "../../../api/clients/queries/clientsWithFacilites";
import usersQuery from "../../../api/users/queries/listUsersByRole";
import ReportsEnum from "../../../api/schedules/enums/reports";
import {AutoForm, ErrorField} from '/imports/ui/forms';
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import schema from '/imports/api/schedules/schemas/schema'
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/schedules/queries/scheduleList";

class ScheduleBlock extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            clients: [],
            schedule: false,
            blankSchedule: false
        }
    }

    componentWillMount() {
        usersQuery.clone({}).fetch((err, users) => {
            if (!err) {
                this.setState({
                    users
                });
            } else {
                Notifier.error('Couldn\'t get users');
            }
        });

        clientsQuery.clone({}).fetch((err, clients) => {
            if (!err) {
                this.setState({
                    clients
                });
            } else {
                Notifier.error(err + 'Couldn\'t get clients');
            }
        });
    }

    getUserOptions(users) {
        return _.map(users, ({_id, profile, roles}) => {
            const role = roles && roles[0];
            const value = profile.firstName + ' ' + profile.lastName + ' (' + role + ')';
            return {value: _id, label: value};
        });
    }

    getClientOptions(clients) {
        return _.map(clients, ({_id, clientName, facilities}) => {
            let clientFacilities = '';
            if (facilities)
                clientFacilities = facilities.map(function (elem) {
                    return elem.name;
                }).join(',');

            const value = `${clientName} (${clientFacilities})`;
            return {value: _id, label: value};
        });
    }

    onAddSchedule = () => {
        this.setState({
            blankSchedule: true
        });
    };

    close = () => {
        this.setState({
            blankSchedule: false
        });
    };

    onDeleteSchedule = (_id) => {
        Meteor.call('schedule.delete', _id, (err) => {
            if (!err) {
                Notifier.success("Schedule removed!");
            } else
                Notifier.error(err.reason);
        })
    };

    render() {
        const {data, error, loading, report} = this.props;
        const {blankSchedule} = this.state;
        const users = this.getUserOptions(this.state.users);
        const clients = this.getClientOptions(this.state.clients);
        schema = schema.omit("reportId");

        if (loading) {
            return <Loading/>;
        }

        if (error) {
            return <div>Error: {error.reason}</div>;
        }

        return (
            <div className="action-block schedule-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Schedule</div>
                </div>
                <div className="main__block">
                    <div className="add-content" onClick={this.onAddSchedule}>
                        <i className="icon-calendar-plus-o"/>
                        <div className="text-center">+ Add schedule</div>
                    </div>
                    {
                        blankSchedule &&
                        <CreateSchedule
                            close={this.close}
                            clients={clients}
                            users={users}
                            report={report}
                            cancel={this.close}
                        />
                    }

                    <div className="schedule-list">
                        {
                            data.map((schedule, index) => {
                                return (
                                    <div key={index} className="schedule-item">
                                        <div className="left__side">
                                            <div className="info">
                                                <div className="text-light-grey">Frequency</div>
                                                <div className="info-label">{
                                                    schedule.frequency.map((frequency, index) => {

                                                        if (index === schedule.frequency.length - 1) {
                                                            return frequency
                                                        } else {
                                                            return frequency + ", "
                                                        }
                                                    })
                                                }</div>
                                            </div>
                                        </div>
                                        <div className="btn-group">
                                            <button onClick={this.onDeleteSchedule.bind(this, schedule._id)}
                                                    className="btn-cancel">
                                                <i className="icon-trash-o"/>
                                            </button>
                                            <button className="btn--blue">Send</button>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

class CreateSchedule extends Component {
    constructor() {
        super();
    }

    onSubmit = (data) => {
        const {model} = this.props;
        const {report} = this.props;
        if (!model) {
            data.reportId = report._id;
            Meteor.call("schedule.create", data, (err) => {
                if (!err) {
                    Notifier.success("Schedule created!");
                    this.props.close();
                } else {
                    Notifier.error(err.reason);
                }
            })
        } else {
            model.reportId = report._id;
            Meteor.call('report.sendNow', model, (err) => {
                if (!err) {
                    Notifier.success("Emails sent!");
                } else {
                    Notifier.error(err.reason);
                }
            })
        }
    };

    render() {
        const {users, clients, model, close} = this.props;

        return (
            <div className="new-section">
                <div className="text-label text-light-grey">Create schedule</div>
                <div className="schedule-form">
                    <AutoForm model={model} schema={schema} onSubmit={this.onSubmit.bind(this)}>
                        <div className="form-wrapper">
                            <SelectMulti placeholder="Select Frequency" noLabel={true} name="frequency"
                                         options={ReportsEnum.frequency}/>
                            <ErrorField name="frequency"/>
                        </div>

                        <div className="form-wrapper">
                            <SelectMulti placeholder="Select Internal Users" noLabel={true} name="userIds"
                                         options={users}/>
                            <ErrorField name="userIds"/>
                        </div>

                        <div className="form-wrapper">
                            <SelectMulti placeholder="Select External Users" noLabel={true} name="clientIds"
                                         options={clients}/>
                            <ErrorField name="clientIds"/>
                        </div>

                        <div className="btn-group">
                            <button type="button" className="btn-cancel" onClick={close}>Cancel</button>
                            <button className="btn--green">
                                {
                                    model ?
                                        'Send now' :
                                        'Confirm schedule'
                                }
                            </button>
                        </div>
                    </AutoForm>
                </div>
            </div>
        )
    }
}

export default withQuery((props) => {
    return query.clone({filters: {reportId: props.report._id}});
}, {reactive: true})(ScheduleBlock)
