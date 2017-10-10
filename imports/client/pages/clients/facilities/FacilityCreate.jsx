import React from 'react';
import {AutoForm, AutoField, ErrorField} from 'uniforms-unstyled';
import FacilitySchema from "/imports/client/pages/clients/facilities/schemas/facilitySchema.js";
import FacilityContact from "./components/FacilityContact.jsx";
import Notifier from '/imports/client/lib/Notifier';

export default class FacilityCreate extends React.Component {
    onSubmit = (data) => {
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
                <AutoForm schema={FacilitySchema} onSubmit={this.onSubmit}>
                    <AutoField name="name"/>
                    <ErrorField name="name"/>

                    <AutoField name="addressOne"/>
                    <ErrorField name="addressOne"/>

                    <AutoField name="addressTwo"/>
                    <ErrorField name="addressTwo"/>

                    <AutoField name="city"/>
                    <ErrorField name="city"/>

                    <AutoField name="state"/>
                    <ErrorField name="state"/>

                    <AutoField name="zipCode"/>
                    <ErrorField name="zipCode"/>

                    <AutoField name="region"/>
                    <ErrorField name="region"/>
                    {/*TODO multiSelect*/}

                    <h4>Add facility contacts</h4>
                    <FacilityContact/>

                    <button type="submit">Create</button>
                </AutoForm>
            </div>
        );
    }
}