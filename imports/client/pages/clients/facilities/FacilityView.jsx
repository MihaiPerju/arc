import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import moment from 'moment';
import FacilityContact from "./components/FacilityContact";

export default class FacilityView extends React.Component {
    constructor() {
        super();

        this.state = {
            facility: null,
            loading: true
        }
    }

    componentDidMount() {
        const {facilityId} = FlowRouter.current().params;
        Meteor.call('facility.get', facilityId, (err, facility) => {
            if(err) {
                return Notifier.error('Error while getting facility!');
            }

            this.setState({
                facility,
                loading: false
            })
        })
    }

    render() {
        const {loading, facility} = this.state;

        if(loading) {
            return <Loading/>;
        }

        const {name, addressOne, addressTwo, city, state} = facility;
        const {zipCode, status, region, createdAt, contacts} = facility;

        return (
            <div>
                <h3>Facility {name}</h3>
                <h5>Status: {status}</h5>
                <h5>State: {state}</h5>
                <h5>Region: {region}</h5>
                <h5>City {city}</h5>
                <h5>Address 1: {addressOne}</h5>
                <h5>Address 2: {addressTwo}</h5>
                <h5>Zip: {zipCode}</h5>
                <h5>Creation date: {moment(createdAt).format('MM/DD/YYYY hh:mm')}</h5>

                {contacts.length
                    ?
                    <div>
                        <h4>Contacts</h4>
                        {contacts.map(contact => (
                            <FacilityContact contact={contact}/>
                        ))}
                    </div>
                    :
                    <div>
                        <h4>No Contacts</h4>
                    </div>
                }
            </div>
        );
    }
}