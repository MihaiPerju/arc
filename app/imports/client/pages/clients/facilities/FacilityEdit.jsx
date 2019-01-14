import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import FacilitySchema from "/imports/api/facilities/schema.js";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField,
  LongTextField,
  ListField,
  ListItemField,
  NestField
} from "/imports/ui/forms";
import SelectUsersContainer from "/imports/client/pages/clients/facilities/components/SelectUsersContainer.jsx";
import Loading from "/imports/client/lib/ui/Loading";
import { frequencyOptions } from "/imports/api/facilities/enums/frequency";
import { getToken } from "/imports/api/uploads/utils";
import { getFacilityImagePath } from "/imports/api/utils";
import DropzoneComponent from "react-dropzone-component";
import SimpleSchema from "simpl-schema";

export default class FacilityCreate extends Component {
  constructor() {
    super();
    this.state = {
      newContact: false,
      regions: [],
      loading: true,
      isDisabled: false,
      isDisabledPassword: false
    };
  }

  componentWillMount() {
    let regionFilters = { clientId: FlowRouter.current().params._id };

    Meteor.call("regions.get", regionFilters, (err, regions) => {
      if (!err) {
        this.setState({
          regions,
          loading: false
        });
      } else {
        Notifier.error("Couldn't get regions");
      }
    });
  }

  getRegionOptions = regions => {
    return regions.map(region => ({
      value: region._id,
      label: region.name
    }));
  };

  onRemoveLogo() {
    const { facility } = this.props;

    Meteor.call("facility.removeLogo", facility._id, err => {
      if (!err) {
        Notifier.success("Logo removed!");
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onSubmit(data) {
    this.setState({ isDisabled: true });
    data.clientId = FlowRouter.current().params._id;
    Meteor.call("facility.update", data, err => {
      if (!err) {
        Notifier.success("Facility updated!");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  }

  onCreateFacility = () => {
    const { form } = this.refs;
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  onPasswordSubmit = data => {
    const { facility } = this.props;
    const { password } = data;
    const { passwordForm } = this.refs;
    this.setState({ isDisabledPassword: true });
    Meteor.call("facility.updatePassword", password, facility._id, err => {
      if (!err) {
        Notifier.success("Facility password updated!");
        passwordForm.reset();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabledPassword: false });
    });
  };

  render() {
    const { regions, loading, isDisabled, isDisabledPassword } = this.state;
    const regionIds = this.getRegionOptions(regions);
    const schema = FacilitySchema.omit("clientId");

    const { facility } = this.props;
    if (loading) {
      return <Loading />;
    }

    const componentConfig = {
      postUrl: "/uploads/facility-logo/" + facility._id + "/" + getToken()
    };

    const djsConfig = {
      complete(file) {
        Notifier.success("Logo added");
        this.removeFile(file);
      },
      acceptedFiles: "image/*"
    };

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.onCreateFacility}
              className="btn--green"
            >
              {isDisabled ? (
                <div>
                  {" "}
                  Loading
                  <i className="icon-cog" />
                </div>
              ) : (
                "Confirm & Save"
              )}
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block i--block drop-file">
            <AutoForm
              schema={schema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
              model={facility}
            >
              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}

              <div className="main__block">
                {facility && facility.logoPath ? (
                  <div className="text-center">
                    <img
                      className="lg-avatar img-circle border--light-grey"
                      src={getFacilityImagePath(facility.logoPath)}
                    />
                    <div className="btn-group m-t--10">
                      <a
                        href="javascript:;"
                        className="cc-button btn-text--red"
                        onClick={this.onRemoveLogo.bind(this)}
                      >
                        Remove Logo
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="btn-group-1">
                    <div className="add-content">
                      <i className="icon-upload" />
                      <div className="drop-file__wrapper">
                        <DropzoneComponent
                          config={componentConfig}
                          djsConfig={djsConfig}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-wrapper">
                <AutoField placeholder="Name" name="name" />
                <ErrorField name="name" />
              </div>
              <div className="form-wrapper">
                <AutoField
                  
                  placeholder="First address"
                  name="addressOne"
                />
                <ErrorField name="addressOne" />
              </div>
              <div className="form-wrapper">
                <AutoField
                  
                  placeholder="Second address"
                  name="addressTwo"
                />
                <ErrorField name="addressTwo" />
              </div>
              <div className="form-wrapper">
                <AutoField  placeholder="City" name="city" />
                <ErrorField name="city" />
              </div>
              <div className="form-wrapper">
                <AutoField
                  
                  placeholder="State"
                  name="state"
                />
                <ErrorField name="state" />
              </div>
              {/* <div className="form-wrapper">
                <AutoField
                  
                  placeholder="Sftp path"
                  name="sftpPath"
                />
                <ErrorField name="sftpPath" />
              </div> */}
              <div className="form-wrapper">
                <AutoField  placeholder="Host" name="host" />
                <ErrorField name="host" />
              </div>
              <div className="form-wrapper">
                <AutoField  placeholder="User" name="user" />
                <ErrorField name="user" />
              </div>
              <div className="select-group">
                <div className="form-wrapper">
                  <div>
                    <SelectField
                      
                      name="frequency"
                      options={frequencyOptions}
                    />
                    <ErrorField name="frequency" />
                  </div>
                </div>
              </div>
              <div className="form-wrapper">
                <AutoField
                  
                  placeholder="Zip code"
                  name="zipCode"
                />
                <ErrorField name="zipCode" />
              </div>
              <div className="select-group">
                <div className="form-wrapper">
                  {regionIds && (
                    <div>
                      <SelectField
                        
                        name="regionId"
                        options={regionIds}
                      />
                      <ErrorField name="regionId" />
                    </div>
                  )}
                </div>
              </div>
              <SelectUsersContainer />
              <ListField name="contacts" showListField={() => {}}>
                <ListItemField name="$">
                  <NestField>
                    <div>
                      <div className="form-wrapper">
                        <AutoField
                          
                          placeholder="First Name"
                          name="firstName"
                        />
                        <ErrorField name="firstName" />
                      </div>
                      <div className="form-wrapper">
                        <AutoField
                          
                          placeholder="Last Name"
                          name="lastName"
                        />
                        <ErrorField name="lastName" />
                      </div>
                      <div className="form-wrapper">
                        <AutoField
                          
                          placeholder="Phone"
                          name="phone"
                        />
                        <ErrorField name="phone" />
                      </div>
                      <div className="form-wrapper">
                        <AutoField
                          
                          placeholder="Email"
                          name="email"
                        />
                        <ErrorField name="email" />
                      </div>
                      <div className="select-group">
                        <div className="form-wrapper">
                          <AutoField
                            
                            placeholder="Contact Type"
                            name="contactType"
                          />
                          <ErrorField name="contactType" />
                        </div>
                      </div>
                      <div className="form-wrapper">
                        <LongTextField
                          
                          placeholder="Notes"
                          name="notes"
                        />
                        <ErrorField name="notes" />
                      </div>
                    </div>
                  </NestField>
                </ListItemField>
              </ListField>
            </AutoForm>
            <div className="action-block m-t--20">
              <div className="header__block">
                <div className="title-block text-uppercase">
                  Change Password
                </div>
              </div>
              <AutoForm
                schema={changePasswordSchema}
                onSubmit={this.onPasswordSubmit.bind(this)}
                ref="passwordForm"
              >
                <div className="form-wrapper">
                  <AutoField
                    type="password"
                    
                    placeholder="Password"
                    name="password"
                  />
                  <ErrorField name="password" />
                </div>
                <div className="btn-group m-t--10 text--right">
                  <button
                    style={isDisabledPassword ? { cursor: "not-allowed" } : {}}
                    disabled={isDisabledPassword}
                    className="btn--green"
                  >
                    {isDisabled ? (
                      <div>
                        {" "}
                        Loading
                        <i className="icon-cog" />
                      </div>
                    ) : (
                      "Confirm"
                    )}
                  </button>
                </div>
              </AutoForm>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const changePasswordSchema = new SimpleSchema({
  password: {
    type: String
  }
});
