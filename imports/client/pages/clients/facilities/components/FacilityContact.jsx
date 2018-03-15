import React from 'react';
import {Divider} from 'semantic-ui-react';

export default class FacilityContact extends React.Component {
    render() {
        const {contact} = this.props;

        return (
            <div>
                <h6>First name: {contact.firstName}</h6>
                <h6>Last name: {contact.lastName}</h6>
                <h6>Type: {contact.contactType}</h6>
                <h6>Email: {contact.email}</h6>
                <h6>Phone: {contact.phone}</h6>
                <h6>Notes: {contact.notes}</h6>
                <Divider/>
            </div>
        );
    }
}