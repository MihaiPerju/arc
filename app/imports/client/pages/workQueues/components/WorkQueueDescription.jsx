import React, { Component } from "react";
import { AutoForm, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import WorkQueueContentSingle from "./WorkQueueContentSingle";
import Notifier from "/imports/client/lib/Notifier";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";

export default class WorkQueueDescription extends Component {
  constructor() {
    super();
    this.state = {
      selectedUser: [],
      selectAllChkBox: false,
      isDisabled: false
    };
  }

  getOptions = users => {
    return _.map(users, user => ({
      value: user._id,
      label: `${user.profile.firstName} ${user.profile.lastName}`
    }));
  };

  onSubmit = data => {
    const { userIds } = data;
    const { currentWorkQueue } = this.props;
    this.setState({ isDisabled: true });
    Meteor.call(
      "user.addWorkQueue",
      { userIds, WorkQueueId: currentWorkQueue._id },
      err => {
        if (!err) {
          Notifier.success("Successfully added !");
          this.refs.form.reset();
        } else {
          Notifier.success(err.reason);
        }
        this.setState({ isDisabled: false });
      }
    );
  };

  handleSelectAll = () => {
    const { oldUsers } = this.props;
    let { selectAllChkBox } = this.state;
    let selectedUser = [];
    selectAllChkBox = false;
    if (!this.refs.selectAll.checked) {
      selectAllChkBox = true;
      selectedUser = oldUsers.map(user => user._id);
    }
    this.setState({ selectedUser, selectAllChkBox });
  };

  toggleUser = userId => {
    const { selectedUser } = this.state;
    const index = selectedUser.indexOf(userId);
    if (index === -1) {
      selectedUser.push(userId);
    } else {
      selectedUser.splice(index, 1);
    }
    this.setState({ selectedUser });
  };

  removeWorkQueues = userIds => {
    const { currentWorkQueue } = this.props;
    this.refs.form.reset();
    if (userIds.length > 0) {
      Meteor.call(
        "user.removeWorkQueues",
        { userIds, workQueueId: currentWorkQueue._id },
        err => {
          if (!err) {
            Notifier.success("Removed successfully !");
            this.setState({ selectAllChkBox: false, selectedUser: [] });
          } else {
            Notifier.error(err.reason);
          }
        }
      );
    }
  };

  render() {
    const { newUsers, oldUsers } = this.props;
    const options = this.getOptions(newUsers);
    const { selectedUser, selectAllChkBox, isDisabled } = this.state;

    return (
      <div className="create-form">
        <div className="action-block i--block">
          <div className="header__block">
            <div className="title-block text-uppercase">Users</div>
          </div>
          <AutoForm
            schema={schema}
            onSubmit={this.onSubmit.bind(this)}
            ref="form"
          >
            <div className="select-group">
              <div className="form-wrapper">
                <SelectMulti
                  className="form-select__multi"
                  placeholder="Select Users"
                  labelHidden={true}
                  name="userIds"
                  options={options}
                />
                <ErrorField name="userIds" />
              </div>
            </div>
            <div className="btn-group-1 flex--helper flex-justify--end">
              <button
                style={isDisabled ? { cursor: "not-allowed" } : {}}
                disabled={isDisabled}
                className="btn--green"
              >
                {isDisabled ? (
                  <div>
                    {" "}
                    Loading
                    <i className="icon-cog" />
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </AutoForm>
        </div>

        <div className="select__row flex--helper flex-justify--space-between flex-align--center">
          <div className="check-item">
            <input
              id="selectAll"
              ref="selectAll"
              type="checkbox"
              className="hidden"
              checked={selectAllChkBox}
            />
            <label htmlFor="selectAll" onClick={this.handleSelectAll}>
              Select all
            </label>
          </div>
          <button
            onClick={() => this.removeWorkQueues(selectedUser)}
            className="btn-text--grey"
          >
            <i className="icon-trash-o" />
          </button>
        </div>

        <div className="action-table">
          <div className="action-table__wrapper">
            <div className="action-table__row flex--helper">
              <div className="action-table__header action-table__field text-light-grey">
                Name
              </div>
              <div className="action-table__header action-table__field text-center text-light-grey">
                Actions
              </div>
            </div>
            {oldUsers.map((user, index) => (
              <WorkQueueContentSingle
                key={index}
                userName={`${user.profile.firstName} ${user.profile.lastName}`}
                userId={user._id}
                selectedUser={selectedUser}
                toggleUser={this.toggleUser}
                removeWorkQueues={this.removeWorkQueues}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const schema = new SimpleSchema({
  userIds: {
    type: Array
  },
  "userIds.$": {
    type: String
  }
});
