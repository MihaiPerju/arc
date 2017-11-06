import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import FacilityForm from "./components/FacilityForm.jsx";
import {Header} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'

export default class FacilityCreate extends React.Component {
    createFacility = (data) => {
        data.clientId = FlowRouter.current().params._id;

        Meteor.call('facility.create', data, (err) => {
            if (err) {
                return Notifier.error('Error while creating new facility!')
            }

            FlowRouter.go("facility.list", {_id: data.clientId});
        })
    };

    render() {
        return (
            <Container className="page-container">
                <Header as="h3" textAlign="center">Create facility</Header>
                <FacilityForm submitAction={this.createFacility}/>
            </Container>
        );
    }
}