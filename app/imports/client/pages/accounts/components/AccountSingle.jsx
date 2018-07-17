import React, { Component } from "react";
import classNames from "classnames";
import moment from "moment/moment";
import commaNumber from "comma-number";
import SimpleSchema from "simpl-schema";
import Dialog from "/imports/client/lib/ui/Dialog";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import { AutoForm, ErrorField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";

export default class AccountSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontNormal: false,
      checked: false,
      dialogIsActive: false
    };
  }

  onCheck(e) {
    e.stopPropagation();
    const { checkAccount, account } = this.props;
    checkAccount(account);
  }

  onSelectAccount() {
    const { selectAccount, account } = this.props;
    selectAccount(account);
  }

  onhandleTag = e => {
    e.stopPropagation();
    this.setState({ dialogIsActive: true });
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  getOptions = tags => {
    return _.map(tags, tag => ({
      value: tag._id,
      label: tag.name
    }));
  };

  onSubmit = data => {
    const { _id } = this.props.account;
    Object.assign(data, { _id });

    Meteor.call("account.tag", data, err => {
      if (!err) {
        Notifier.success("Tagged successfully");
      } else {
        Notifier.error(err.error);
      }
      this.closeDialog();
    });
  };

  confirmTags = () => {
    const { form } = this.refs;
    form.submit();
  };

  render() {
    const {
      account,
      active,
      currentAccount,
      isExpiredTickle,
      expiredTickle,
      moduleTags
    } = this.props;

    const { dialogIsActive } = this.state;

    const options = this.getOptions(moduleTags);

    const classes = classNames("list-item task-item", {
      "bg--yellow": active,
      "tickled-item": expiredTickle == 1,
      open: account._id === currentAccount
    });

    const model = {
      tagIds: account.tagIds
    };

    return (
      <div className={classes} onClick={this.onSelectAccount.bind(this)}>
        <div className="check-item">
          <input type="checkbox" checked={active} className="hidden" />
          <label onClick={this.onCheck.bind(this)} />
          <a onClick={this.onhandleTag.bind(this)}>
            <img
              style={{ width: "16px", margin: "8px" }}
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDIyIDI0Ij48cGF0aCBkPSJNMTkuNSAxNi4yODZxMC0uNTM2LS4zNzUtLjkxbC0yLjc4Ni0yLjc4N3EtLjM3Ni0uMzc2LS45MTItLjM3Ni0uNTYzIDAtLjk2NC40M2wuMjU0LjI0N3EuMjE0LjIwOC4yODguMjl0LjIuMjUzLjE3NS4zNDIuMDQ4LjM2OHEwIC41MzYtLjM3NS45MXQtLjkxLjM3NnEtLjIwMiAwLS4zNy0uMDQ4dC0uMzQtLjE3NC0uMjU1LS4yLS4yODgtLjI5LS4yNDgtLjI1M3EtLjQ0Mi40MTUtLjQ0Mi45NzggMCAuNTM2LjM3NS45MWwyLjc2IDIuNzczcS4zNi4zNjIuOTEuMzYyLjUzNiAwIC45MS0uMzQ4bDEuOTctMS45NTVxLjM3NS0uMzc1LjM3NS0uODk3em0tOS40MTUtOS40NDJxMC0uNTM2LS4zNzUtLjkxTDYuOTUgMy4xNnEtLjM3NC0uMzc0LS45MS0uMzc0LS41MjIgMC0uOTEuMzYyTDMuMTYgNS4xMDNxLS4zNzUuMzc1LS4zNzUuODk3IDAgLjUzNi4zNzUuOTFsMi43ODYgMi43ODdxLjM2Mi4zNjIuOTEuMzYyLjU2NCAwIC45NjUtLjQxNmwtLjI1My0uMjQ4cS0uMjEzLS4yMDgtLjI4OC0uMjg4dC0uMjAyLS4yNTQtLjE3NC0uMzQyLS4wNDctLjM2OHEwLS41MzYuMzc1LS45MXQuOTEtLjM3NnEuMjAyIDAgLjM3LjA0N3QuMzQuMTc0LjI1NS4yLjI4OC4yODguMjQ4LjI1NHEuNDQyLS40MTUuNDQyLS45Nzh6bTExLjk4NiA5LjQ0MnEwIDEuNjA3LTEuMTM3IDIuNzJsLTEuOTcgMS45NTRxLTEuMTEgMS4xMTItMi43MTggMS4xMTItMS42MiAwLTIuNzMyLTEuMTM4bC0yLjc2LTIuNzcycS0xLjExLTEuMTEyLTEuMTEtMi43MiAwLTEuNjQ2IDEuMTc4LTIuNzk4bC0xLjE3OC0xLjE4cS0xLjE1MiAxLjE4LTIuNzg2IDEuMTgtMS42MDcgMC0yLjczMi0xLjEyNUwxLjMzOCA4LjczMlEuMjEzIDcuNjA4LjIxMyA2VDEuMzUgMy4yODNsMS45Ny0xLjk1NVE0LjQzMi4yMTUgNi4wNC4yMTVxMS42MiAwIDIuNzMgMS4xMzhsMi43NiAyLjc3MnExLjExMiAxLjExMiAxLjExMiAyLjcyIDAgMS42NDYtMS4xOCAyLjc5OGwxLjE4IDEuMThxMS4xNTItMS4xOCAyLjc4Ni0xLjE4IDEuNjA3IDAgMi43MzIgMS4xMjVsMi43ODYgMi43ODZxMS4xMjUgMS4xMjUgMS4xMjUgMi43MzJ6Ii8+PC9zdmc+"
              alt=""
            />
          </a>
        </div>
        <div className="mark-task">
          <input type="checkbox" className="hidden" />
          <label />
        </div>
        <div className="row__item">
          <div className="left__side">
            <div
              className={
                this.state.fontNormal ? "person font-normal" : "person"
              }
            >
              {account.ptName}
            </div>
          </div>
          <div className="right__side">
            <div className="pacient-id text-blue">{account.acctNum}</div>
            <div className="financial-class">O/D</div>
            <div className="time">
              {account && moment(account.createdAt).format(" hh:mm")}
            </div>
          </div>
        </div>
        <div className="row__item">
          <div className="price">{commaNumber(account.acctBal)}</div>
          <div className="location">
            {account.facility && account.facility.name}
          </div>
        </div>
        {dialogIsActive && (
          <Dialog
            title="Tag Account"
            className="account-dialog"
            closePortal={this.closeDialog}
          >
            <AutoForm
              schema={schema}
              ref="form"
              onSubmit={this.onSubmit.bind(this)}
              model={model}
            >
              <div className="select-group">
                <div className="form-wrapper">
                  <SelectMulti
                    className="form-select__multi"
                    placeholder="Select modules"
                    labelHidden={true}
                    name="tagIds"
                    options={options}
                  />
                  <ErrorField name="tagIds" />
                </div>
              </div>
            </AutoForm>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button onClick={this.confirmTags} className="btn--light-blue">
                Confirm & Tag
              </button>
            </div>
          </Dialog>
        )}
      </div>
    );
  }
}

const schema = new SimpleSchema({
  tagIds: {
    type: Array,
    defaultValue: []
  },
  "tagIds.$": {
    type: String
  }
});
