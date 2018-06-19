import React, { Component } from "react";
import moment from "moment/moment";
import AccountActioning from "./AccountActioning";
import RolesEnum from "/imports/api/users/enums/roles";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import DatePicker from "react-datepicker";
import fieldTypes from "/imports/api/accounts/config/accounts";
import "react-datepicker/dist/react-datepicker.css";

export default class AccountContentHeader extends Component {
  constructor(props) {
    console.log(props);
    super();
    this.state = {
      editField: null,
      schema: null,
      date: null
    };
  }

  getOptions(users) {
    let options = [];
    if (users) {
      for (user of users) {
        let item = {
          label:
            user &&
            user.profile &&
            user.profile.firstName +
              " " +
              user.profile.lastName +
              "(" +
              user.roles[0] +
              ")",
          value: user && user._id
        };
        options.push(item);
      }
    }
    return options;
  }

  getAssignee() {
    const { account } = this.props;
    if (account.assignee) {
      const { profile } = account.assignee;
      return (
        <div className="label label--grey">
          {profile.firstName + " " + profile.lastName}
        </div>
      );
    } else if (account.tag) {
      return <div className="label label--grey">{account.tag.name}</div>;
    }
    return <div className="label label--red">Unassigned</div>;
  }

  getFirstOption(account, options) {
    if (account.assigneeId) {
      for (option of options) {
        if (option.value === account.assigneeId) {
          return [option];
        }
      }
    }
    return [{ label: "Unassigned" }];
  }

  onEditField = editField => {
    const { account } = this.props;
    this.setState({ editField });
    if (fieldTypes.dates.includes(editField)) {
      console.log("Setting again");
      this.setState({ date: moment(account[editField]) });
    }
  };

  getSchema = editField => {
    return new SimpleSchema({ [editField]: { type: String } });
  };

  onSubmit = data => {
    const { editField } = this.state;
    console.log(data);
  };

  onBlur = () => {
    //Reset
    this.setState({ schema: null, editField: null });
  };

  onDateSelect = newDate => {
    console.log(newDate);
    this.setState({ date: newDate });
  };

  getEditForm = name => {
    const { account } = this.props;
    const { date } = this.state;
    const schema = this.getSchema(name);

    if (fieldTypes.dates.includes(name)) {
      return (
        <DatePicker
          placeholderText="Date"
          selected={moment(date)}
          onChange={this.onDateSelect}
        />
      );
    }
    return (
      <AutoForm
        onBlur={this.onBlur}
        model={{ [name]: account[name] }}
        schema={schema}
        onSubmit={this.onSubmit}
      >
        <div className="form-wrapper select-item">
          <AutoField
            labelHidden={true}
            name={name}
            inputRef={x => {
              if (x) {
                x.focus();
              }
            }}
          />
          <ErrorField name={name} />
        </div>
      </AutoForm>
    );
  };

  render() {
    const { account, openMetaData, closeRightPanel } = this.props;
    const { editField, startDate } = this.state;

    const options = this.getOptions(
      account && account.facility && account.facility.users
    );
    let userOptions = this.getFirstOption(account, options).concat(options);
    return (
      <div className="header-block header-account">
        <div className="main-info">
          <div className="left__side">
            <div onClick={this.onEditField.bind(this, "ptName")}>
              {editField === "ptName" ? (
                this.getEditForm("ptName")
              ) : (
                <div className="name">{account.ptName}</div>
              )}
            </div>

            <div className="row__block">
              <div className="pacient-id text-blue">{account.acctNum}</div>
              <div className="financial-class">O/D</div>
              <div className="location">
                {account.facility ? account.facility.name : "No insurance name"}{" "}
                -{" "}
                {account.client ? account.client.clientName : "No client name"}
              </div>
              <div className="label-group">
                <div className="label label--green">158 points(TBM)</div>
                <div className="label label--grey text-uppercase">
                  CARC(TNM)
                </div>
                {this.getAssignee()}
              </div>
            </div>
          </div>
          <div className="right__side">
            <div className="price-col">
              <div className="price">{account.collectedAmount}</div>
              <div className="text-light-grey">Collected amount</div>
            </div>
            <div
              onClick={this.onEditField.bind(this, "acctBal")}
              className="price-col"
            >
              {editField === "acctBal" ? (
                this.getEditForm("acctBal")
              ) : (
                <div className="price">
                  {account.acctBal ? account.acctBal : 0}
                </div>
              )}
              <div className="text-light-grey">Remaining balance</div>
            </div>
          </div>

          <div className="btn-group">
            <AccountActioning
              type={"Assign"}
              title={"Assign account:"}
              model={account}
              accountId={account._id}
              options={userOptions}
              closeRightPanel={closeRightPanel}
            />
            {Roles.userIsInRole(Meteor.userId(), RolesEnum.REP) &&
              !account.escalationId && (
                <AccountActioning
                  escalate
                  accountId={account._id}
                  type="Escalate"
                  title="Escalate"
                  escalationId={account.escalationId}
                  closeRightPanel={closeRightPanel}
                />
              )}

            <AccountActioning
              metaData={true}
              type="View Meta Data"
              openMetaData={openMetaData}
              closeRightPanel={closeRightPanel}
              title=""
            />
            <AccountActioning
              tickle={true}
              type="Tickle"
              accountId={account._id}
              title="Confirm"
              closeRightPanel={closeRightPanel}
            />
          </div>
        </div>
        <div className="additional-info">
          <ul style={{ paddingBottom: "150px" }}>
            <li className="text-center">
              <div className="text-light-grey">Substate</div>
              <div className="text-dark-grey text-uppercase">
                {account.substate}
              </div>
            </li>
            <li
              onClick={this.onEditField.bind(this, "finClass")}
              className="text-center"
            >
              <div className="input-datetime flex--helper flex--column" />
              <div className="text-light-grey">Financial class</div>
              {editField === "finClass" ? (
                this.getEditForm("finClass")
              ) : (
                <div className="text-dark-grey text-uppercase">
                  {account.finClass ? account.finClass : "None"}
                </div>
              )}
            </li>
            <li
              onClick={this.onEditField.bind(this, "dischrgDate")}
              className="text-center"
            >
              <div className="text-light-grey">Discharge date</div>
              {editField === "dischrgDate" ? (
                this.getEditForm("dischrgDate")
              ) : (
                <div className="text-dark-grey">
                  {account && moment(account.dischrgDate).format("MM/DD/YYYY")}
                </div>
              )}
            </li>
            <li
              onClick={this.onEditField.bind(this, "createdAt")}
              className="text-center"
            >
              <div className="text-light-grey">Placement date</div>
              {editField === "createdAt" ? (
                this.getEditForm("createdAt")
              ) : (
                <div className="text-dark-grey">
                  {account && moment(account.createdAt).format("MM/DD/YYYY")}
                </div>
              )}
            </li>
          </ul>
        </div>
        <div className="additional-info">
          <ul style={{ paddingBottom: "150px" }}>
            <li
              onClick={!editField && this.onEditField.bind(this, "admitDate")}
              className="text-center"
            >
              <div className="text-light-grey">Admit date</div>
              {editField === "admitDate" ? (
                this.getEditForm("admitDate")
              ) : (
                <div className="text-dark-grey">
                  {account && moment(account.admitDate).format("MM/DD/YYYY")}
                </div>
              )}
            </li>

            <li
              onClick={this.onEditField.bind(this, "facCode")}
              className="text-center"
            >
              <div className="text-light-grey">Facility Code</div>
              {editField === "facCode" ? (
                this.getEditForm("facCode")
              ) : (
                <div className="text-dark-grey text-uppercase">
                  {account.facCode}
                </div>
              )}
            </li>
            <li
              onClick={this.onEditField.bind(this, "ptType")}
              className="text-center"
            >
              <div className="text-light-grey">Patient Type</div>
              {editField === "ptType" ? (
                this.getEditForm("ptType")
              ) : (
                <div className="text-dark-grey text-uppercase">
                  {account.ptType}
                </div>
              )}
            </li>
            <li
              onClick={this.onEditField.bind(this, "fbDate")}
              className="text-center"
            >
              <div className="text-light-grey">Last Bill Date</div>
              {editField === "fbDate" ? (
                this.getEditForm("fbDate")
              ) : (
                <div className="text-dark-grey">
                  {account && moment(account.fbDate).format("MM/DD/YYYY")}
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
