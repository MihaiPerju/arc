import React from 'react';
import {Container, Header, Divider, Button, Tab} from 'semantic-ui-react'
import usersQuery from '/imports/api/users/queries/listUsersByRole';
import ScheduleWidget from './components/ScheduleWidget';
import Notifier from '/imports/client/lib/Notifier';
import Loading from '/imports/client/lib/ui/Loading';

export default class ReportSchedule extends React.Component {
    constructor() {
        super();

        this.state = {
            users: [],
            blankSchedule: false
        }
    }

    componentWillMount() {
        usersQuery.clone({}).fetch((err, users) => {
            if (!err) {
                this.setState({
                    users
                })
            } else {
                Notifier.error("Couldn't get users");
            }
        });
    }

    getUserOptions(users) {
        return _.map(users, ({_id, profile, roles}) => {
            const value = `${profile.firstName} ${profile.lastName} (${roles[0]})`;
            return {value: _id, label: value};
        })
    }

    onAddSchedule() {
        this.setState({
            blankSchedule: true
        })
    }

    onCancelSchedule() {
        this.setState({
            blankSchedule: false
        })
    }

    render() {
        const users = this.getUserOptions(this.state.users);
        const {id, data, error, loading} = this.props;
        const {blankSchedule} = this.state;

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <Container>
                {
                    !blankSchedule &&
                    <Button primary fluid onClick={this.onAddSchedule.bind(this)}>Add Scheduling</Button>
                }
                {
                    blankSchedule &&
                    <div>
                        <Header as="h2" textAlign="center">
                            Create Schedule
                        </Header>
                        < ScheduleWidget
                            users={users}
                            reportId={id}
                            onCancelSchedule={this.onCancelSchedule.bind(this)}/>
                    </div>
                }
                <Header as="h2" textAlign="center">
                    Report Schedules
                </Header>
                {
                    data.map((schedule, index) => {
                        return (
                            <ScheduleWidget users={users} key={index} model={schedule}/>
                        )
                    })
                }

            </Container>
        )
    }
}
