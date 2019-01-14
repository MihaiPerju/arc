import React, { Component } from "react";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Notifier from "/imports/client/lib/Notifier";
import TagsService from "./services/TagsService";
import RolesEnum from "/imports/api/users/enums/roles";

export default class EditUser extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      isDisabled: false
    };
  }

  onSubmit(formData) {
    const { user } = this.props;
    this.setState({ isDisabled: true });
    Meteor.call("admin.editUser", user._id, formData, err => {
      if (!err) {
        Notifier.success("Data saved !");
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  }

  getTagList = () => {
    const { data } = this.props;

    return data.map(tag => ({
      value: tag._id,
      label: TagsService.getTagName(tag)
    }));
  };

  closeEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  onEditUser = () => {
    const { form } = this.refs;
    form.submit();
  };

  render() {
    const { user } = this.props;
    const { isDisabled } = this.state;
    user.email = user.emails[0].address;

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.closeEdit} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.onEditUser}
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
          <div className="action-block">
            <div className="header__block">
              <div className="title-block text-uppercase">
                Client information
              </div>
            </div>

            <AutoForm
              model={user}
              schema={EditSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
            >
              {this.state.error ? (
                <div className="error">{this.state.error}</div>
              ) : (
                ""
              )}

              <div className="form-wrapper">
                <AutoField
                  // // 
                  placeholder="First name"
                  name="profile.firstName"
                />
                <ErrorField name="profile.firstName" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  // 
                  placeholder="Last name"
                  name="profile.lastName"
                />
                <ErrorField name="profile.lastName" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  // 
                  placeholder="Email"
                  name="email"
                />
                <ErrorField name="email" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  // 
                  placeholder="Phone Number"
                  name="profile.phoneNumber"
                />
                <ErrorField name="profile.phoneNumber" />
              </div>
              {user && user.roles && user.roles[0] == RolesEnum.REP && (
                <div className="form-wrapper">
                  <AutoField
                    // 
                    placeholder="Goal"
                    name="profile.goal"
                  />
                  <ErrorField name="profile.goal" />
                </div>
              )}
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}

const EditSchema = new SimpleSchema({
  profile: { type: Object },
  "profile.firstName": { type: String },
  "profile.lastName": { type: String },
  "profile.phoneNumber": { type: String, optional: true },
  "profile.goal": { type: Number, optional: true },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  tagIds: {
    label: "Tags",
    type: Array,
    optional: true
  },
  "tagIds.$": {
    type: String
  }
});
