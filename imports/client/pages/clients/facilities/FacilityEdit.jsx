import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import FacilityForm from "./components/FacilityForm.jsx";
import TabSelect from '/imports/client/lib/TabSelect';
import tabsEnum from '/imports/client/pages/clients/facilities/enums/tabs';
import UploadPlacementFile from '/imports/client/pages/clients/facilities/components/UploadPlacementFile';
import {Container} from 'semantic-ui-react'
import UploadInventoryFile from './components/UploadInventoryFile';
import UploadPaymentFile from './components/UploadPaymentFile';
import {AutoForm, AutoField, ErrorField, SelectField, LongTextField, ListField, ListItemField, NestField} from '/imports/ui/forms';
import SelectUsersContainer from '/imports/client/pages/clients/facilities/components/SelectUsersContainer.jsx';
import FacilitySchema from '/imports/api/facilities/schema.js';
import RegionListQuery from '/imports/api/regions/queries/regionList.js';


export default class FacilityEdit extends React.Component {
    constructor() {
        super();

        this.state = {
            facility: null,
            loading: true,
            regions: []
        };
    }
    componentWillMount() {
        RegionListQuery.clone({
            filters: {
                clientId: FlowRouter.current().params._id
            }
        }).fetch((err, regions) => {
            if (!err){
                this.setState({
                    regions
                });
            } else {
                Notifier.error('Couldn\'t get regions');
            }
        })
    }

    componentDidMount() {
        this.getFacility();
    }

    getFacility = () => {
        const {facilityId} = FlowRouter.current().params;
        Meteor.call('facility.get', facilityId, (err, facility) => {
            if (err) {
                return Notifier.error('Error while getting facility!');
            }

            this.setState({
                facility,
                loading: false
            })
        })
    };

    updateFacility = (data) => {
        Meteor.call('facility.update', data, (err) => {
            if (err) {
                return Notifier.error('Error while updating facility!');
            }

            Notifier.success('Facility updated!');
            this.getFacility();
        })
    };
    closeEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    onEditFacility = () => {
        const {form} = this.refs;
        form.submit();
    };
    getRegionOptions = (regions) => {
        return regions.map((region, key) => ({value: region._id, label: region.name}));
    };

    render() {
        const schema = FacilitySchema.omit('clientId');
        const {loading, facility, regions} = this.state;
        const regionIds = this.getRegionOptions(regions);
        const tabOptions = [
            {
                label: tabsEnum.GENERAL,
                component: <FacilityForm purpose="Edit" model={facility} submitAction={this.updateFacility}/>
            },
            {
                label: tabsEnum.PLACEMENT_FILE,
                component: <UploadPlacementFile updateFacility={this.getFacility}
                                                model={facility}/>
            },
            {
                label: tabsEnum.INVENTORY_FILE,
                component: <UploadInventoryFile updateFacility={this.getFacility}
                                                model={facility}/>
            },
            {
                label: tabsEnum.PAYMENT_FILE,
                component: <UploadPaymentFile updateFacility={this.getFacility}
                                                model={facility}/>
            }
        ];

        if (loading) {
            return <Loading/>;
        }

        return (
            <Container className="page-container">
                <TabSelect options={tabOptions}/>
                <div className="create-form">
                    <div className="create-form__bar">
                        <button className="btn-add">+ Add facility</button>
                        <div className="btn-group">
                            <button
                                onClick={this.closeEdit} className="btn-cancel">Cancel</button>
                            <button
                                onClick={this.onEditFacility} className="btn--green">Confirm & save</button>
                        </div>
                    </div>
                    <div className="create-form__wrapper">
                        <div className="action-block i--block">
                            <AutoForm schema={schema} onSubmit={this.updateFacility.bind(this)} ref="form">
                                {this.state.error && <div className="error">{this.state.error}</div>}
                                <div className="form-wrapper">
                                    <AutoField labelHidden={true} placeholder="Name" name="name"/>
                                    <ErrorField name="name"/>
                                </div>
                                <div className="select-group">

                                    <div className="form-wrapper">
                                        <AutoField labelHidden={true} placeholder="Status" name="status"/>
                                        <ErrorField name="status"/>
                                    </div>
                                </div>
                                <div className="form-wrapper">
                                    <AutoField labelHidden={true} placeholder="First address" name="addressOne"/>
                                    <ErrorField name="addressOne"/>
                                </div>
                                <div className="form-wrapper">
                                    <AutoField labelHidden={true} placeholder="Second address" name="addressTwo"/>
                                    <ErrorField name="addressTwo"/>
                                </div>
                                <div className="form-wrapper">
                                    <AutoField labelHidden={true} placeholder="City" name="city"/>
                                    <ErrorField name="city"/>
                                </div>
                                <div className="form-wrapper">
                                    <AutoField labelHidden={true} placeholder="State" name="state"/>
                                    <ErrorField name="state"/>
                                </div>
                                <div className="form-wrapper">
                                    <AutoField labelHidden={true} placeholder="Sftp state" name="sftpPath"/>
                                    <ErrorField name="sftpPath"/>
                                </div>
                                <div className="form-wrapper">
                                    <AutoField labelHidden={true} placeholder="Zip code" name="zipCode"/>
                                    <ErrorField name="zipCode"/>
                                </div>
                                <div className="select-group">
                                    <div className="form-wrapper">
                                        {
                                            regionIds
                                            &&
                                            <div>
                                                <SelectField name="regionId" options={regionIds}/>
                                                < ErrorField name="regionId"/>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <SelectUsersContainer/>
                                <ListField name="contacts">
                                    <ListItemField name="$">
                                        <NestField>
                                            <div>
                                                <div className="form-wrapper">
                                                    <AutoField labelHidden={true} placeholder="First Name" name="firstName"/>
                                                    <ErrorField name="firstName"/>
                                                </div>
                                                <div className="form-wrapper">
                                                    <AutoField labelHidden={true} placeholder="Last Name" name="lastName"/>
                                                    <ErrorField name="lastName"/>
                                                </div>
                                                <div className="form-wrapper">
                                                    <AutoField labelHidden={true} placeholder="Phone" name="phone"/>
                                                    <ErrorField name="phone"/>
                                                </div>
                                                <div className="form-wrapper">
                                                    <AutoField labelHidden={true} placeholder="Email" name="email"/>
                                                    <ErrorField name="email"/>
                                                </div>
                                                <div className="select-group">
                                                    <div className="form-wrapper">
                                                        <AutoField labelHidden={true} placeholder="Contact Type" name="contactType"/>
                                                        <ErrorField name="contactType"/>
                                                    </div>
                                                </div>
                                                <div className="form-wrapper">
                                                    <LongTextField labelHidden={true} placeholder="Notes" name="notes"/>
                                                    <ErrorField name="notes"/>
                                                </div>
                                            </div>
                                        </NestField>
                                    </ListItemField>
                                </ListField>
                            </AutoForm>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}