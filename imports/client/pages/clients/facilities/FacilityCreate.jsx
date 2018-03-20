import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import FacilitySchema from '/imports/api/facilities/schema.js'
import {AutoForm, AutoField, ErrorField, SelectField, LongTextField, ListField, ListItemField, NestField} from '/imports/ui/forms';
import RegionListQuery from '/imports/api/regions/queries/regionList.js';
import SelectUsersContainer from '/imports/client/pages/clients/facilities/components/SelectUsersContainer.jsx';

export default class FacilityCreate extends Component {
    constructor() {
        super();
        this.state = {
            newContact: false,
            regions: []
        }
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

    getRegionOptions = (regions) => {
        return regions.map((region, key) => ({value: region._id, label: region.name}));
    };

    onSubmit(data) {
        data.clientId = FlowRouter.current().params._id;
        Meteor.call('facility.create', data, (err) => {
            if (!err) {
                Notifier.success('Facility added!');
                FlowRouter.reload();//go('facility.list', {_id: FlowRouter.current().params._id});
                this.onClose();
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    newContact = () => {
        this.setState({
            newContact: true
        })
    }

    closeNewCotact = () => {
        this.setState({
            newContact: false
        })
    }

    onCreateFacility = () => {
        const {form} = this.refs;
        form.submit();
    }

    onClose = () => {
        const {close} = this.props;
        close();
    };

    render() {
        const { newContact, regions } = this.state;
        const regionIds = this.getRegionOptions(regions);
        const schema = FacilitySchema.omit('clientId');
        return (
            <div className="create-form create-facility">
                    <div className="create-form__bar">
                        <button className="btn-add">+ Add facility</button>
                        <div className="btn-group">
                            <button
                               onClick={this.onClose} className="btn-cancel">Cancel</button>
                            <button
                                onClick={this.onCreateFacility} className="btn--green">Confirm & save</button>
                        </div>
                    </div>
                    <div className="create-form__wrapper">
                        <div className="action-block i--block">
                            <AutoForm schema={schema} onSubmit={this.onSubmit.bind(this)} ref="form">
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
        );
    }
}

class NewContact extends Component {
    render() {
        const { close } = this.props;

        return (
            <div className="action-block action-new-contact">
                <div className="header__block">
                    <div className="title-block text-uppercase">Contact information</div>
                </div>
                <div className="row__action">
                    <div className="type">Contact nr. 1</div>
                    <div className="btn-delete" onClick={close}>Delete</div>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Client name"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="First name"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Phone number"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Email"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Phone number"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Email"/>
                </div>
                <div className="select-group">
                    <div className="form-wrapper">
                        <select name="filter">
                            <option value="">Contact Description</option>
                        </select>
                    </div>
                </div>
                <div className="form-wrapper">
                    <textarea placeholder="*Note"></textarea>
                </div>
            </div>
        )
    }
}