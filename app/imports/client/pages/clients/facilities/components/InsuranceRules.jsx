import React from "react";
import {
  AutoField,
  ErrorField,
  ListField,
  ListItemField,
  NestField
} from "/imports/ui/forms";

export default class InsuranceRules extends React.Component {
  render() {
    const { collapse, showListField } = this.props;
    return (
      <ListField collapse={collapse} showListField={showListField} name="insurances">
        <ListItemField name="$">
          <NestField>
            <div className="upload-item">
              <div className="text-center">
                <AutoField className="text-light-grey" name="insName" />
                <ErrorField name="insName" />
              </div>
              <div className="text-center">
                <AutoField className="text-light-grey" name="insCode" />
                <ErrorField name="insCode" />
              </div>
              <div className="text-center">
                <AutoField className="text-light-grey" name="insBal" />
                <ErrorField name="insBal" />
              </div>
            </div>
            <div className="upload-item">
              <div className="text-center">
                <AutoField className="text-light-grey" name="address1" />
                <ErrorField name="address1" />
              </div>
              <div className="text-center">
                <AutoField className="text-light-grey" name="address2" />
                <ErrorField name="address2" />
              </div>
            </div>
            <div className="upload-item">
              <div className="text-center">
                <AutoField className="text-light-grey" name="city" />
                <ErrorField name="city" />
              </div>
              <div className="text-center">
                <AutoField className="text-light-grey" name="state" />
                <ErrorField name="state" />
              </div>
              <div className="text-center">
                <AutoField className="text-light-grey" name="zip" />
                <ErrorField name="zip" />
              </div>
            </div>
            <div className="upload-item">
              <div className="text-center">
                <AutoField className="text-light-grey" name="policy" />
                <ErrorField name="policy" />
              </div>
              <div className="text-center">
                <AutoField className="text-light-grey" name="phone" />
                <ErrorField name="phone" />
              </div>
            </div>
          </NestField>
        </ListItemField>
      </ListField>
    );
  }
}
