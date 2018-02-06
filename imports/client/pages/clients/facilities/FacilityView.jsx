import React from 'react';
import moment from 'moment';
import FacilityContact from './components/FacilityContact';
import { Header } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';
import Loading from '/imports/client/lib/ui/Loading.jsx';
import Notifier from '/imports/client/lib/Notifier';
import {getImagePath} from '/imports/api/utils';
import FacilityContactsTable from './components/FacilityContactsTable';

export default class FacilityView extends React.Component {
    constructor () {
        super();

        this.state = {
            facility: null,
            loading: true,
            regions: []
        };
    }

    componentDidMount () {
        this.getFacility();
    }

    getRegions (regionIds) {
        regionIds = regionIds || [];
        Meteor.call('facility.getRegions', regionIds, (err, regions) => {
            if (err) {
                Notifier.error('Couldn\'t get facility regions');
            } else {
                this.setState({
                    regions
                });
            }
        });
    }

    getFacility = () => {
        const {facilityId} = FlowRouter.current().params;
        Meteor.call('facility.get', facilityId, (err, facility) => {
            if (err) {
                return Notifier.error('Error while getting facility!');
            } else {
                this.setState({
                    facility,
                    loading: false
                });
                this.getRegions(facility.regionIds);
            }
        });
    };

    render () {
        const {loading, facility, regions} = this.state;
        if (loading) {
            return <Loading/>;
        }
        
        if (!facility) {
            return (
                <Container className="page-container">
                    No facility found !
                </Container>);
        }

        const rootUrl = Meteor.settings.public.ROOT_URL || '/themes/default/';
        const logoPath = facility.logoPath ? path(facility.logoPath) : `${rootUrl}assets/img/no_logo.svg`;

        return (
            <Container className="page-container">
                <Header as="h3" textAlign="center">Facility {facility.name}</Header>
                <div>
                    <img src={getImagePath(facility.logoPath)}/>
                </div>
                <h5>Status: {facility.status}</h5>
                <h5>State: {facility.state}</h5>
                <h5>Region: {facility.region}</h5>
                <h5>City {facility.city}</h5>
                <h5>Address 1: {facility.addressOne}</h5>
                <h5>Address 2: {facility.addressTwo}</h5>
                <h5>Zip: {facility.zipCode}</h5>
                <h5>Creation date: {moment(facility.createdAt).format('MM/DD/YYYY hh:mm')}</h5>
                {
                    regions && <div>
                        <h4>Regions:</h4>
                        {
                            regions.map((region, index) => {
                                return <div key={index}>{region.name}</div>;
                            })
                        }
                    </div>
                }
                {facility.contacts && facility.contacts.length
                    ?
                    <div>
                        <h4>Contacts</h4>
                        <FacilityContactsTable contacts={facility.contacts}/>
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