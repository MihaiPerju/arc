import React from 'react';
import {AutoForm, AutoField, ErrorField, RadioField, ListField, ListItemField, NestField} from '/imports/ui/forms';
import Notifier from '/imports/client/lib/Notifier';
import PropTypes from 'prop-types';
import RulesService from '/imports/client/pages/clients/facilities/services/ImportingRulesService';
import Loading from '/imports/client/lib/ui/Loading';
import UploadItem from './FacilityContent/UploadItem'

export default class ImportingRules extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true
        }
    }

    componentWillMount() {
        const {model, rules} = this.props;
        const schema = RulesService.createSchema(rules, model && model[rules] && model[rules].hasHeader);
        this.setState({
            loading: false,
            schema
        });
    }

    onSubmitImportingRules = (importRules) => {
        const facilityId = this.props.model._id;
        const {rules} = this.props;
        const newFacility = {_id: facilityId};
        newFacility[rules] = importRules;
        Meteor.call('facility.update', newFacility, (err) => {
            if (!err) {
                Notifier.success("Facility updated!");
                // this.props.updateFacility();
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    onChange(field, value) {
        const {rules} = this.props;
        if (field === 'hasHeader') {
            //Change schema
            const newSchema = RulesService.createSchema(rules, value);

            this.setState({
                schema: newSchema
            })
        }
    }

    groupFields(fields) {
        const numInRow = 4;
        const numGroups = Math.round(fields.length / numInRow);
        let result = [];
        for (let i = 0; i < numGroups; i++) {
            const startIndex = i * numInRow;
            const finishIndex = Math.min((i + 1) * numInRow, fields.length);
            const groupOfFields = fields.slice(startIndex, finishIndex);
            result.push(groupOfFields);
        }
        return result;
    }

    render() {
        const {schema, loading} = this.state;
        const {model, rules} = this.props;
        const fields = RulesService.getSchemaFields(rules);
        const options = [{value: true, label: 'True'}, {value: false, label: 'False'}];
        const fieldGroups = this.groupFields(fields);

        return (
            <div>
                {
                    loading ?
                        <Loading/> :
                        <AutoForm model={model[rules]} schema={schema}
                                  onChange={this.onChange.bind(this)}
                                  onSubmit={this.onSubmitImportingRules}>

                            <div className="form-wrapper">
                                <div className="upload-section">
                                    <div className="radio-group">
                                        <RadioField className="radio-group__wrapper" name="hasHeader" options={options}/>
                                        <ErrorField name="hasHeader"/>
                                    </div>
                                </div>
                            </div>

                            <div className="upload-list">
                                {
                                    fieldGroups && fieldGroups.map((fields) => {
                                        return <UploadItem fields={fields}/>
                                    })
                                }
                            </div>
                            <div className="upload-list">
                                {
                                    schema._schemaKeys.includes("insurances") ?
                                        <ListField name="insurances">
                                            <ListItemField name="$">
                                                <NestField className="upload-item text-center">
                                                    <AutoField
                                                        className="text-light-grey"
                                                        name="insName"
                                                    />
                                                    <ErrorField name="insName"/>
                                                    <AutoField
                                                        className="text-light-grey"
                                                        name="insCode"/>
                                                    <ErrorField name="insCode"/>

                                                    <AutoField
                                                        className="text-light-grey"
                                                        name="insBal"/>
                                                    <ErrorField name="insBal"/>
                                                </NestField>
                                            </ListItemField>
                                        </ListField>
                                        :
                                        <ListField name="newInsBal">
                                            <ListItemField name="$">
                                                <NestField className="upload-item text-center">
                                                    <div>
                                                        <AutoField
                                                            className="text-light-grey" name="insBal"/>
                                                        <ErrorField name="insBal"/>
                                                    </div>
                                                </NestField>
                                            </ListItemField>
                                        </ListField>
                                }
                            </div>
                            <div className="btn-group">
                                {/*<button className="btn--red">Cancel</button>*/}
                                <button className="btn--green">Submit</button>
                            </div>
                        </AutoForm>
                }
            </div>
        )
    }
}

ImportingRules
    .propTypes = {
    model: PropTypes.object
};