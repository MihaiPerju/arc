import React from 'react';
import FacilityContactList from "./FacilityContactList.jsx";
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import FacilitySchema from "/imports/api/facilities/schema.js";
import FacilityStatusEnum from '/imports/api/facilities/enums/statuses.js';
import FacilityRegionEnum from "/imports/api/facilities/enums/regions.js";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import SelectUsersContainer from './SelectUsersContainer';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

export default class FacilityForm extends React.Component {
    constructor() {
        super();

        this.state = {
            users: []
        };
    }

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
            <Container>
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

                    <SelectUsersContainer/>

                    <h4>Contacts</h4>
                    <FacilityContactList/>

                    <Divider/>

                    <Button primary fluid type="submit">Submit</Button>
                </AutoForm>
            </Container>
        );
    }
}