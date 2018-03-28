import React from 'react';
import {AutoField, ErrorField, ListField, ListItemField, NestField} from '/imports/ui/forms';

export default class InsuranceRules extends React.Component {
    render() {
        return (
            <ListField name="insurances">
                <ListItemField name="$">
                    <NestField className="upload-item text-center">
                        <div className="insurance-item__wrapper">
                            <AutoField
                                className="text-light-grey"
                                name="insName"
                            />
                            <ErrorField name="insName"/>
                        </div>
                        <div className="insurance-item__wrapper">
                            <AutoField
                                className="text-light-grey"
                                name="insCode"/>
                            <ErrorField name="insCode"/>
                        </div>
                        <div className="insurance-item__wrapper">
                            <AutoField
                                className="text-light-grey"
                                name="insBal"/>
                            <ErrorField name="insBal"/>
                        </div>
                        <div className="insurance-item__wrapper">
                            <AutoField
                                className="text-light-grey"
                                name="address1"/>
                            <ErrorField name="address1"/>
                        </div>
                        <div className="insurance-item__wrapper">
                            <AutoField
                                className="text-light-grey"
                                name="address2"/>
                            <ErrorField name="address2"/>
                        </div>
                        <div className="insurance-item__wrapper">
                            <AutoField
                                className="text-light-grey"
                                name="city"/>
                            <ErrorField name="city"/>
                        </div>
                        <div className="insurance-item__wrapper">
                            <AutoField
                                className="text-light-grey"
                                name="state"/>
                            <ErrorField name="state"/>
                        </div>
                        <div className="insurance-item__wrapper">
                            <AutoField
                                className="text-light-grey"
                                name="zip"/>
                            <ErrorField name="zip"/>
                        </div>
                        <div className="insurance-item__wrapper">
                            <AutoField
                                className="text-light-grey"
                                name="policy"/>
                            <ErrorField name="policy"/>
                        </div>
                        <div className="insurance-item__wrapper">
                            <AutoField
                                className="text-light-grey"
                                name="phone"/>
                            <ErrorField name="phone"/>
                        </div>
                    </NestField>
                </ListItemField>
            </ListField>
        )
    }
}