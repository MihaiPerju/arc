import React from 'react';
import FacilityContactList from "./FacilityContactList.jsx";
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-unstyled';
import FacilitySchema from "/imports/api/facilities/schema.js";
import FacilityStatusEnum from '/imports/api/facilities/enums/statuses.js';
import FacilityRegionEnum from "/imports/api/facilities/enums/regions.js";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";


export default class FacilityForm extends React.Component {
    onSubmit = (data) => {
        this.props.submitAction(data);
    };

    getOptions = (enums) => {
        return _.map(enums, (value, key) => ({value, label: value}));
    };

    render() {
        const {model} = this.props;
        const statuses = this.getOptions(FacilityStatusEnum);
        const regions = this.getOptions(FacilityRegionEnum);
        const schema = FacilitySchema.omit("clientId", "createdAt");
        let newModel = model ? model : {
            status: FacilityStatusEnum.NEW,
            region: []
        };

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

                    <SelectMulti name="region" options={regions}/>
                    <ErrorField name="region"/>

                    <h4>Contacts</h4>
                    <FacilityContactList/>

                    <button type="submit">Submit</button>
                </AutoForm>
            </div>
        );
    }
}