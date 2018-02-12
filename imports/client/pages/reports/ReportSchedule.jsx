import React from 'react';
import { Container, Header, Divider, Button, Tab } from 'semantic-ui-react';
import usersQuery from '/imports/api/users/queries/listUsersByRole';
import ScheduleWidget from './components/ScheduleWidget';
import Notifier from '/imports/client/lib/Notifier';
import Loading from '/imports/client/lib/ui/Loading';
import clientsQuery from '/imports/api/clients/queries/clientsWithFacilites';

export default class ReportSchedule extends React.Component {
    constructor () {
        super();

        this.state = {
            users: [],
            clients: [],
            blankSchedule: false
        };
    }

    componentWillMount () {
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

    getUserOptions (users) {
        return _.map(users, ({_id, profile, roles}) => {
            const value = `${profile.firstName} ${profile.lastName} (${roles[0]})`;
            return {value: _id, label: value};
        });
    }

    getClientOptions (clients) {
        return _.map(clients, ({_id, clientName, facilities}) => {
            let clientFacilities = '';
            if (facilities)
                clientFacilities = facilities.map(function (elem) { return elem.name; }).join(',');

            const value = `${clientName} (${clientFacilities})`;
            return {value: _id, label: value};
        });
    }

    onAddSchedule () {
        this.setState({
            blankSchedule: true
        });
    }

    onCancelSchedule () {
        this.setState({
            blankSchedule: false
        });
    }

    render () {
        const users = this.getUserOptions(this.state.users);
        const clients = this.getClientOptions(this.state.clients);
        const {id, data, error, loading} = this.props;
        const {blankSchedule} = this.state;

        if (loading) {
            return <Loading/>;
        }

        if (error) {
            return <div>Error: {error.reason}</div>;
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
                            clients={clients}
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
                            <ScheduleWidget reportId={id} users={users} clients={clients} key={index} model={schedule}/>
                        );
                    })
                }
            </Container>
        );
    }
}
