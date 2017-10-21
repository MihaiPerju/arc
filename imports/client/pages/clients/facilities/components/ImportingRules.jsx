import React from 'react';
import {AutoForm, AutoField, ErrorField, RadioField} from 'uniforms-unstyled';
import schema from '/imports/api/facilities/schemas/importRulesSchema';
import Notifier from '/imports/client/lib/Notifier';

export default class ImportingRules extends React.Component {
    constructor() {
        super();
    }

    onSubmitImportingRules = (importRules) => {
        const facilityId = this.props.model._id;

        Meteor.call('facility.update', {_id: facilityId, importRules}, (err) => {
            if (!err) {
                Notifier.success("Facility updated!");
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    render() {
        const {model} = this.props;
        const options = [{value: true, label: 'True'}, {value: false, label: 'False'}];

        return (
            <div>
                <AutoForm model={model.importRules} ref="form2" schema={schema} onSubmit={this.onSubmitImportingRules}>

                    <RadioField name="hasHeader" options={options}/>
                    <ErrorField name="hasHeader"/>

                    <AutoField name="acctNum"/>
                    <ErrorField name="acctNum"/>

                    <AutoField name="FacCode"/>
                    <ErrorField name="FacCode"/>

                    <AutoField name="PtType"/>
                    <ErrorField name="PtType"/>

                    <AutoField name="PtName"/>
                    <ErrorField name="PtName"/>

                    <AutoField name="DischrgDate"/>
                    <ErrorField name="DischrgDate"/>

                    <AutoField name="FBDate"/>
                    <ErrorField name="FBDate"/>

                    <AutoField name="AcctBal"/>
                    <ErrorField name="AcctBal"/>

                    <AutoField name="FinClass"/>
                    <ErrorField name="FinClass"/>

                    <AutoField name="AdmitDate"/>
                    <ErrorField name="AdmitDate"/>

                    <AutoField name="MedNo"/>
                    <ErrorField name="MedNo"/>

                    <AutoField name="InsName"/>
                    <ErrorField name="InsName"/>

                    <AutoField name="InsName2"/>
                    <ErrorField name="InsName2"/>

                    <AutoField name="InsName3"/>
                    <ErrorField name="InsName3"/>

                    <AutoField name="InsCode"/>
                    <ErrorField name="InsCode"/>

                    <AutoField name="InsCode2"/>
                    <ErrorField name="InsCode2"/>

                    <AutoField name="InsCode3"/>
                    <ErrorField name="InsCode3"/>

                    <AutoField name="InsBal"/>
                    <ErrorField name="InsBal"/>

                    <AutoField name="InsBal2"/>
                    <ErrorField name="InsBal2"/>

                    <AutoField name="InsBal3"/>
                    <ErrorField name="InsBal3"/>

                    <button type="submit">Submit</button>
                </AutoForm>
            </div>
        )
    }
}