import React from 'react';
import {Divider} from 'semantic-ui-react';

export default class FacilityContact extends React.Component {
    render () {
        const {
            contactDescription,
            firstName,
            lastName,
            phone,
            email,
            notes} = this.props.contact;

        return (
            <div>
                <h6>First name: {firstName}</h6>
                <h6>Last name: {lastName}</h6>
                <h6>Description: {contactDescription}</h6>
                <h6>Email: {email}</h6>
                <h6>Phone: {phone}</h6>
                <h6>Notes: {notes}</h6>
                <Divider/>
            </div>
        );
    }
}