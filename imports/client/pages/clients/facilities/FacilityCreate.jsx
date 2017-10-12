import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import FacilityForm from "./components/FacilityForm.jsx";

export default class FacilityCreate extends React.Component {
    createFacility = (data) => {
        data.clientId = FlowRouter.current().params._id;

        Meteor.call('facility.create', data, (err) => {
            if(err) {
                return Notifier.error('Error while creating new facility!')
            }

            FlowRouter.go("facility.list", {_id: data.clientId});
        })
    };

    render() {
        return (
            <div>
                <h3>Create facility</h3>
                <FacilityForm submitAction={this.createFacility}/>
            </div>
        );
    }
}