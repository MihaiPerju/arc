import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField
} from "/imports/ui/forms";
import pages from "/imports/api/settings/enums/settings";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class WidgetSettings extends Component {
  constructor() {
    super();
    this.state = {
      isDisabled: false,
      isLoading: true,
      model: {}
    };
  }

  submit = () => {
    this.refs.form.onSubmit();
  };

  componentDidMount() {
    Meteor.call("managerSettings.get", pages.THRESHOLDS, (err, model) => {
      if (!err) {
        this.setState({
          model
        });
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isLoading: false });
    });
  }

  onSubmit = data => {
    data.name = pages.THRESHOLDS;
    Meteor.call("managerSettings.update", data, err => {
      if (!err) {
        Notifier.success("Settings Updated!");
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onClose = () => {
    this.props.onClose();
  };

  render() {
    const { isDisabled, isLoading, model } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              disabled={isDisabled}
              onClick={this.submit}
              className="btn--green"
            >
              {isDisabled ? "Loading..." : "Submit"}
            </button>
          </div>
        </div>
      <div className="main-content m-t--10">
        <div className="header-block header-account">
          <div className="additional-info account-info">
          <ul  >
            <li className="menu__item widget_menu"><span className="menu__label">Escalation Resolved</span> <input type="checkbox" /></li>
            <li className="menu__item widget_menu"><span className="menu__label">Accounts Assigned</span> <input type="checkbox" /></li>
            <li className="menu__item widget_menu"><span className="menu__label">Holds Removed</span> <input type="checkbox" /></li>
            <li className="menu__item widget_menu"><span className="menu__label">Reports Generated</span> <input type="checkbox" /></li>
            <li className="menu__item widget_menu"><span className="menu__label">Reports Sent</span> <input type="checkbox" /></li>
            <li className="menu__item widget_menu"><span className="menu__label">Accounts Archived</span> <input type="checkbox" /></li>
            <li className="menu__item widget_menu"><span className="menu__label">Manager Rank</span> <input type="checkbox" /></li>
            <li className="menu__item widget_menu"><span className="menu__label">New Alerts</span> <input type="checkbox" /></li>
          </ul>
        </div>
        </div>
      </div>
      </div>
    );
  }
}

const schema = new SimpleSchema({
  satisfactory: {
    type: Number
  },
  unsatisfactory: {
    type: Number
  },
  acceptanceRatio: {
    type: Number
  }
});
