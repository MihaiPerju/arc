import React from 'react';
import moment from 'moment';
import { Header } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';
import Loading from '/imports/client/lib/ui/Loading.jsx';
import Notifier from '/imports/client/lib/Notifier';
import {getImagePath} from '/imports/api/utils';
import FacilityContactsTable from './facilities/components/FacilityContactsTable';

export default class ClientView extends React.Component {
    constructor () {
        super();

        this.state = {
            client: null,
            loading: true
        };
    }

    componentDidMount () {
        this.getClient();
    }

    getClient = () => {
        const {clientId} = this.props;
        Meteor.call('client.get', clientId, (err, client) => {
            if (err) {
                return Notifier.error('Error while getting client!');
            } else {
                this.setState({
                    client,
                    loading: false
                });
            }
        });
    };

    render () {
        const {loading, client} = this.state;
        if (loading) {
            return <Loading/>;
        }

        if (!client) {
            return (
                <Container className="page-container">
                    No client found !
                </Container>);
        }

        const rootUrl = Meteor.settings.public.ROOT_URL || '/themes/default/';
        const logoPath = client.logoPath ? getImagePath(client.logoPath) : `${rootUrl}assets/img/no_logo.svg`;

        return (
            <Container className="page-container">
                <Header as="h3" textAlign="center">Client {client.clientName}</Header>
                <img src={logoPath}/>
                <h5>First name: {client.firstName}</h5>
                <h5>Last name: {client.lastName}</h5>
                <h5>Email: {client.email}</h5>
                <h5>Financial Goals: {client.financialGoals}</h5>
                <h5>Creation date: {moment(client.createdAt).format('MM/DD/YYYY hh:mm')}</h5>
                {
                    client.contacts && client.contacts.length
                        ?
                        <div>
                            <h4>Contacts</h4>
                            <FacilityContactsTable contacts={client.contacts}/>
                        </div>
                        :
                        <div>
                            <h4>No Contacts</h4>
                        </div>
                }
            </Container>
        );
    }
}