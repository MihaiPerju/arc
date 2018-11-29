import React, { Component } from "react";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import SelectSimple from "/imports/client/lib/uniforms/SelectSimple.jsx";
import SimpleSchema from "simpl-schema";
import Notifier from "../../../../lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";
import ActionsHelper from "/imports/api/actions/helpers/OptionsGenerator";
import ReasonCodesHelper from "/imports/api/reasonCodes/helpers/OptionsGenerator";
import DateField from "/imports/client/lib/uniforms/DateField";
import requirementTypes from "/imports/api/actions/enums/requirementEnum";

export default class NewAction extends Component {
  constructor() {
    super();
    this.state = {
      fade: false,
      actions: [],
      reasonCodes: [],
      loading: true,
      selectedActionId: null,
      isDisabled: false
    };
  }

  componentWillMount() {
    Meteor.call("actions.get", (err, actions) => {
      if (!err) {
        this.setState({
          actions,
          loading: false
        });
      }
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 1);
  }

  onSubmit = data => {
    const {
      account,
      hide,
      freezeAccount,
      bulkAssign,
      params,
      accountIds,
      bulkOption
    } = this.props;
    
    const selectedActionId = this.state.selectedActionId;
    const reasonCodes = this.state.reasonCodes;

    if (bulkOption) {
      this.setState({ isDisabled: true });
      let accountList = bulkAssign ? false : accountIds;
      Meteor.call(
        "account.assignAction.bulk",
        data,
        selectedActionId,
        reasonCodes,
        params,
        accountList,
        err => {
          if (!err) {
            hide();
            Notifier.success("Data saved");
          } else {
            Notifier.error(err.reason);
          }
          this.setState({ isDisabled: false });
        }
      );
    } else {
      data.accountId = account._id;
      if (account.assignee) {
        data.addedBy = `${account.assignee.profile.firstName} ${
          account.assignee.profile.lastName
        }`;
      } else if (account.workQueueId) {
        data.addedBy = account.tag.name;
      }

      this.setState({ isDisabled: true });

      Meteor.call("account.addAction", data, err => {
        if (!err) {
          Notifier.success("Data saved");
          //Clear inputs
          this.refs.form.reset();
          hide();
          freezeAccount();
        } else {
          Notifier.error(err.reason);
        }
        this.setState({ isDisabled: false });
      });
    }
  };

  onHide = () => {
    const { hide } = this.props;
    hide();
  };

  onHandleChange = (field, value) => {
    if (field == "actionId") {
      Meteor.call(
        "reasonCodes.get",
        { actionId: value && value.value },
        (err, reasonCodes) => {
          if (!err) {
            this.setState({
              reasonCodes
            });
          } else {
            Notifier.error(err.reason);
          }
        }
      );
      this.setState({ selectedActionId: value });
    }
  };

  setAction = selectedActionId => {
    this.setState({ selectedActionId });
  };

  onChange = (date, label) => {
    this.setState({ [label]: date });
  };

  onChangeNumber = e => {
    e = e || window.event;
    var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9]+$/) && charStr != ".") e.preventDefault();
  };

  getInputSingle = (input, index) => {
    if (input.type === "date") {
      return (
        <div className="custom-inputs" key={index}>
          <DateField label={input.label} name={input.label} />
          <ErrorField name={input.label} />
        </div>
      );
    } else if (input.type === "number") {
      return (
        <div className="custom-inputs" key={index}>
          <AutoField
            placeholder={input.label}
            name={input.label}
            pattern="[0-9]"
            onKeyPress={this.onChangeNumber}
          />
          <ErrorField name={input.label} />
        </div>
      );
    }
    return (
      <div className="custom-inputs" key={index}>
        <AutoField placeholder={input.label} name={input.label} />
        <ErrorField name={input.label} />
      </div>
    );
  };

  getSchema(action) {
    const schema = {
      actionId: {
        type: String,
        optional: true
      },
      reasonCode: {
        type: String,
        optional: true
      }
    };

    //Extend schema for inputs
    if (action && action.inputs) {
      for (let input of action.inputs) {
        let optional = input.requirement === requirementTypes.OPTIONAL;
        if (input.type === "date") {
          _.extend(schema, {
            [input.label]: {
              type: Date,
              optional
            }
          });
        } else if (input.type === "number") {
          _.extend(schema, {
            [input.label]: {
              type: Number,
              optional
            }
          });
        } else {
          _.extend(schema, {
            [input.label]: {
              type: String,
              optional
            }
          });
        }
      }
    }
    return new SimpleSchema(schema);
  }

  render() {
    const {
      selectedActionId,
      loading,
      isDisabled,
      actions,
      reasonCodes
    } = this.state;

    const actionOptions = ActionsHelper.generateOptions(actions);
    const reasonCodeOptions = ReasonCodesHelper.generateOptions(reasonCodes);
    const selectedAction = ActionsHelper.selectAction(
      selectedActionId && selectedActionId.value,
      actions
    );

    const schema = this.getSchema(selectedAction);

    if (loading) {
      return <Loading />;
    }

    return (
      <div className={this.state.fade ? "new-action in" : "new-action"}>
        <div className="action-form">
          <AutoForm
            schema={schema}
            onSubmit={this.onSubmit.bind(this)}
            onChange={this.onHandleChange}
            ref="form"
            className="full-width"
          >
            <div className="select-row">
              <div className="select-group">
                <SelectSimple
                  name="actionId"
                  labelHidden={false}
                  options={actionOptions}
                  placeholder="actions"
                />
                <ErrorField name="actionId" />
              </div>
              {reasonCodeOptions.length > 0 && (
                <div className="select-group">
                  <SelectSimple
                    labelHidden={true}
                    name="reasonCode"
                    options={reasonCodeOptions}
                  />
                  <ErrorField name="reasonCode" />
                </div>
              )}
              <div className="custom-wrapper">
                {selectedAction &&
                  selectedAction.inputs.map((input, index) => {
                    return this.getInputSingle(input, index);
                  })}
              </div>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn--red"
                onClick={this.onHide.bind(this)}
              >
                Cancel
              </button>
              <button
                style={isDisabled ? { cursor: "not-allowed" } : {}}
                disabled={isDisabled}
                type="submit"
                className="btn--green"
              >
                {isDisabled ? (
                  <div>
                    {" "}
                    Loading
                    <i className="icon-cog" />
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </AutoForm>
        </div>
      </div>
    );
  }
}
