import React from 'react';
import FacilityContactList from './FacilityContactList.jsx';
import { AutoForm, AutoField, ErrorField, SelectField } from 'uniforms-semantic';
import FacilitySchema from '/imports/api/facilities/schema.js';
import FacilityStatusEnum from '/imports/api/facilities/enums/statuses.js';
import SelectMulti from '/imports/client/lib/uniforms/SelectMulti.jsx';
import SelectUsersContainer from './SelectUsersContainer';
import { Container, Divider, Button } from 'semantic-ui-react';
import Notifier from '/imports/client/lib/Notifier';
import FacilityLogoUpload from '../components/FacilityLogoUpload';

export default class FacilityForm extends React.Component {
    constructor () {
        super();

        this.state = {
            users: [],
            regions: []
        };
    }

    componentWillMount () {
        Meteor.call('regions.get', (err, regions) => {
            if (!err) {
                this.setState({
                    regions
                });
            } else {
                Notifier.error('Couldn\'t get regions');
            }
        });
    }

    onSubmit = (data) => {
        this.props.submitAction(data);
    };

    getOptions = (enums) => {
        return _.map(enums, (value, key) => ({value, label: value}));
    };

    getRegionOptions = (regions) => {
        return regions.map((region, key) => ({value: region._id, label: region.name}));
    };

    render () {
        const {model, purpose} = this.props;
        const {regions} = this.state;
        const regionIds = this.getRegionOptions(regions);

        const statuses = this.getOptions(FacilityStatusEnum);
        const schema = FacilitySchema.omit('clientId', 'createdAt');
        let newModel = model ? model : {
            status: FacilityStatusEnum.NEW,
            region: []
        };

        return (
            <Container>
                {
                    purpose && purpose == 'Edit' &&
                    <div>
                        <Divider/>
                        < FacilityLogoUpload facilityId={model && model._id}/>
                        <Divider/>
                    </div>
                }

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

                    <AutoField name="sftpPath"/>
                    <ErrorField name="sftpPath"/>

                    <AutoField name="zipCode"/>
                    <ErrorField name="zipCode"/>
                    {
                        regionIds
                        &&
                        <div>
                            <SelectMulti name="regionIds" options={regionIds}/>
                            < ErrorField name="regionIds"/>
                        </div>
                    }

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