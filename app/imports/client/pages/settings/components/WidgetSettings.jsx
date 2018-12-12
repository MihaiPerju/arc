import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import {
  AutoForm,
  ErrorField,
  BoolField
} from "/imports/ui/forms";
import pages from "/imports/api/settings/enums/settings";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";
import RolesEnum from "../../../../api/users/enums/roles";

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
    this.refs.widgetForm.onSubmit();
    this.setState({ isDisabled: true });
  };

  componentDidMount() {
    this.getWidgetSettings();
  }

  getWidgetSettings() {
    Meteor.call("managerSettings.get", pages.WIDGET_SETTINGS, (err, model) => {
      if (!err) {
        this.setState({
          model: model
        });
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isLoading: false });
    });
  }

  onSubmit = data => {
    data.name = pages.WIDGET_SETTINGS;
    console.log(data);
    Meteor.call("managerSettings.update", data, err => {
      if (!err) {
        this.getWidgetSettings();
        Notifier.success("Settings Updated!");
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  onClose = () => {
    this.props.onClose();
  };

  renderManagerWidgetSettings() {
    return (
      <div>
        <div className="widget_item">
          <BoolField
            key="escalation_resolved"
            name="widgetSetting.escalation_resolved"
            label="Escalation Resolved"
          />
          <ErrorField name="widgetSetting.escalation_resolved" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="account_assigned"
            name="widgetSetting.account_assigned"
            label="Accounts Assigned"
          />
          <ErrorField name="widgetSetting.account_assigned" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="holds_removed"
            name="widgetSetting.holds_removed"
            label="Holds Removed"
          />
          <ErrorField name="widgetSetting.holds_removed" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="reports_built"
            name="widgetSetting.reports_built"
            label="Reports Built"
          />
          <ErrorField name="widgetSetting.reports_built" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="report_generated"
            name="widgetSetting.report_generated"
            label="Reports Generated"
          />
          <ErrorField name="widgetSetting.report_generated" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="report_sent"
            name="widgetSetting.report_sent"
            label="Reports Sent"
          />
          <ErrorField name="widgetSetting.report_sent" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="account_archived"
            name="widgetSetting.account_archived"
            label="Accounts Archived"
          />
          <ErrorField name="widgetSetting.account_archived" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="manager_rank"
            name="widgetSetting.manager_rank"
            label="Manager Rank"
          />
          <ErrorField name="widgetSetting.manager_rank" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="new_alert"
            name="widgetSetting.new_alert"
            label="New Alerts"
          />
          <ErrorField name="widgetSetting.new_alert" />
        </div>
        <hr className="divider" />
      </div>
    );
  }

  renderUserWidgetSettings() {
    return (
      <div>
        <div className="widget_item">
          <BoolField
            key="assignedToMe"
            name="widgetSetting.assignedToMe"
            label="Assigned To Me"
          />
          <ErrorField name="widgetSetting.assignedToMe" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="completed"
            name="widgetSetting.completed"
            label="Completed"
          />
          <ErrorField name="widgetSetting.completed" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="collectedToday"
            name="widgetSetting.collectedToday"
            label="Collected Today"
          />
          <ErrorField name="widgetSetting.collectedToday" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="closedAccounts"
            name="widgetSetting.closedAccounts"
            label="Closed Accounts"
          />
          <ErrorField name="widgetSetting.closedAccounts" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="closeAssists"
            name="widgetSetting.closeAssists"
            label="Close Assists"
          />
          <ErrorField name="widgetSetting.closeAssists" />
        </div>
        <hr className="divider" />
      </div>
    );
  }

  renderTechAdminWidgetSettings() {
    return (
      <div>
        <div className="widget_item">
          <BoolField
            key="bulkActionRequestQueue"
            name="widgetSetting.bulkActionRequestQueue"
            label="Bulk Action Request Queue"
          />
          <ErrorField name="widgetSetting.bulkActionRequestQueue" />
        </div>
        <hr className="divider" />
        <div className="widget_item">
          <BoolField
            key="failedUploadQueue"
            name="widgetSetting.failedUploadQueue"
            label="Failed Upload Queue"
          />
          <ErrorField name="widgetSetting.failedUploadQueue" />
        </div>
        <hr className="divider" />
      </div>
    );
  }

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
        <div className="main-content m-t--10 flex_screen">
          <div className="header-block header-account ">
            <div className="additional-info account-info">
              <AutoForm
                model={model}
                onSubmit={this.onSubmit}
                ref="widgetForm"
                className="settings-form"
                schema={schema}
              >
                <div className="widget_div">
                  {/* {(Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) && this.renderManagerWidgetSettings()} */}
                  {(Roles.userIsInRole(Meteor.userId(), RolesEnum.TECH) || Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN)) && this.renderTechAdminWidgetSettings()}
                  {/* {(Roles.userIsInRole(Meteor.userId(), RolesEnum.REP)) && this.renderUserWidgetSettings()} */}
                </div>
              </AutoForm>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const schema = new SimpleSchema({
  widgetSetting: { type: Object },
  "widgetSetting.escalation_resolved": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.account_assigned": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.report_generated": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.holds_removed": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.report_sent": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.account_archived": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.manager_rank": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.new_alert": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.reports_built": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.bulkActionRequestQueue": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.failedUploadQueue": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.assignedToMe": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.completed": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.collectedToday": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.closedAccounts": {
    type: Boolean,
    optional: true
  },
  "widgetSetting.closeAssists": {
    type: Boolean,
    optional: true
  }
});
