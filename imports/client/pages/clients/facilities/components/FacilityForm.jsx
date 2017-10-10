import React from 'react';
import FacilityContact from "./FacilityContact.jsx";
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-unstyled';
import FacilitySchema from "/imports/api/facilities/schema.js";
import FacilityStatusEnum from '/imports/api/facilities/enums/statuses.js';

export default class FacilityForm extends React.Component {
    onSubmit = (data) => {
        this.props.submitAction(data);
    };

    render() {
        const {model} = this.props;
        const statuses = _.map(FacilityStatusEnum, (value, key) => ({value, label: value}));
        const schema = FacilitySchema.omit("clientId", "createdAt");
        let newModel = model ? model : {status: FacilityStatusEnum.NEW};

        return (
            <div>
                <AutoForm schema={schema} model={newModel} onSubmit={this.onSubmit}>
                    <AutoField name="name"/>
                    <ErrorField name="name"/>

                    <SelectField name="status" options={statuses}/>
                    <ErrorField name="status"/>

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

                    <h4>Contacts</h4>
                    <FacilityContact/>

                    <button type="submit">Submit</button>
                </AutoForm>
            </div>
        );
    }
}