import React, { Component } from "react";
import classNames from "classnames";
import Statuses from "/imports/api/letters/enums/statuses.js";
import Dialog from "/imports/client/lib/ui/Dialog";
import Notifier from "/imports/client/lib/Notifier";
import SimpleSchema from "simpl-schema";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import { AutoForm, ErrorField } from "/imports/ui/forms";

export default class LetterSingle extends Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: false,
      tagDialogIsActive: false
    };
  }

  setMailManually = letterId => {
    Meteor.call("letter.mailManually", letterId, err => {
      if (!err) {
        Notifier.success("Letter is manually mailed");
      }
    });
    this.changeStatus(letterId);
  };

  changeStatus = letterId => {
    Meteor.call(
      "letter.updateStatus",
      letterId,
      Statuses.MANUALLY_MAILED,
      err => {
        if (!err) {
          Notifier.success("Status is changed to manually mailed");
        }
      }
    );
  };

  markedManual = () => {
    this.setState({
      dialogIsActive: true
    });
  };

  confirmMarked = letterId => {
    this.setState({
      dialogIsActive: false
    });
    this.setMailManually(letterId);
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false,
      tagDialogIsActive: false
    });
  };

  onhandleTag = e => {
    e.stopPropagation();
    this.setState({ tagDialogIsActive: true });
  };

  getOptions = tags => {
    return _.map(tags, tag => ({
      value: tag._id,
      label: tag.name
    }));
  };

  onSubmit = data => {
    const { _id } = this.props.letter;
    Object.assign(data, { _id });

    Meteor.call("letter.tag", data, err => {
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
    const classes = classNames({
      "list-item": true,
      "user-item": true
    });
    const { letter, moduleTags } = this.props;
    const { dialogIsActive, tagDialogIsActive } = this.state;

    const options = this.getOptions(moduleTags);

    const model = {
      tagIds: letter.tagIds
    };

    return (
      <div className={classes}>
        <div className="check-item">
          <a onClick={this.onhandleTag.bind(this)}>
            <img
              style={{ width: "16px", margin: "8px" }}
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDIyIDI0Ij48cGF0aCBkPSJNMTkuNSAxNi4yODZxMC0uNTM2LS4zNzUtLjkxbC0yLjc4Ni0yLjc4N3EtLjM3Ni0uMzc2LS45MTItLjM3Ni0uNTYzIDAtLjk2NC40M2wuMjU0LjI0N3EuMjE0LjIwOC4yODguMjl0LjIuMjUzLjE3NS4zNDIuMDQ4LjM2OHEwIC41MzYtLjM3NS45MXQtLjkxLjM3NnEtLjIwMiAwLS4zNy0uMDQ4dC0uMzQtLjE3NC0uMjU1LS4yLS4yODgtLjI5LS4yNDgtLjI1M3EtLjQ0Mi40MTUtLjQ0Mi45NzggMCAuNTM2LjM3NS45MWwyLjc2IDIuNzczcS4zNi4zNjIuOTEuMzYyLjUzNiAwIC45MS0uMzQ4bDEuOTctMS45NTVxLjM3NS0uMzc1LjM3NS0uODk3em0tOS40MTUtOS40NDJxMC0uNTM2LS4zNzUtLjkxTDYuOTUgMy4xNnEtLjM3NC0uMzc0LS45MS0uMzc0LS41MjIgMC0uOTEuMzYyTDMuMTYgNS4xMDNxLS4zNzUuMzc1LS4zNzUuODk3IDAgLjUzNi4zNzUuOTFsMi43ODYgMi43ODdxLjM2Mi4zNjIuOTEuMzYyLjU2NCAwIC45NjUtLjQxNmwtLjI1My0uMjQ4cS0uMjEzLS4yMDgtLjI4OC0uMjg4dC0uMjAyLS4yNTQtLjE3NC0uMzQyLS4wNDctLjM2OHEwLS41MzYuMzc1LS45MXQuOTEtLjM3NnEuMjAyIDAgLjM3LjA0N3QuMzQuMTc0LjI1NS4yLjI4OC4yODguMjQ4LjI1NHEuNDQyLS40MTUuNDQyLS45Nzh6bTExLjk4NiA5LjQ0MnEwIDEuNjA3LTEuMTM3IDIuNzJsLTEuOTcgMS45NTRxLTEuMTEgMS4xMTItMi43MTggMS4xMTItMS42MiAwLTIuNzMyLTEuMTM4bC0yLjc2LTIuNzcycS0xLjExLTEuMTEyLTEuMTEtMi43MiAwLTEuNjQ2IDEuMTc4LTIuNzk4bC0xLjE3OC0xLjE4cS0xLjE1MiAxLjE4LTIuNzg2IDEuMTgtMS42MDcgMC0yLjczMi0xLjEyNUwxLjMzOCA4LjczMlEuMjEzIDcuNjA4LjIxMyA2VDEuMzUgMy4yODNsMS45Ny0xLjk1NVE0LjQzMi4yMTUgNi4wNC4yMTVxMS42MiAwIDIuNzMgMS4xMzhsMi43NiAyLjc3MnExLjExMiAxLjExMiAxLjExMiAyLjcyIDAgMS42NDYtMS4xOCAyLjc5OGwxLjE4IDEuMThxMS4xNTItMS4xOCAyLjc4Ni0xLjE4IDEuNjA3IDAgMi43MzIgMS4xMjVsMi43ODYgMi43ODZxMS4xMjUgMS4xMjUgMS4xMjUgMi43MzJ6Ii8+PC9zdmc+"
              alt=""
            />
          </a>
        </div>
        <div className="row__block align-center">
          {letter.isManuallyMailed ? (
            <div className="item-name text-blue">
              {letter.letterTemplate.name && letter.letterTemplate.name}
            </div>
          ) : (
            <div className="item-name text-dark-grey">
              {letter.letterTemplate.name && letter.letterTemplate.name}
            </div>
          )}
          <div className="status pending">{letter.status}</div>
          {letter.status == Statuses.NEW && (
            <button
              className="btn-text--green"
              onClick={this.markedManual.bind(this)}
            >
              Manual Mailing
            </button>
          )}
          {dialogIsActive && (
            <Dialog
              title="Confirm"
              className="account-dialog"
              closePortal={this.closeDialog}
            >
              <div className="form-wrapper">
                Marking a letter manually mailed means it will not be tracked /
                updated by the auto mailing system, are sure you want to mark
                this letter as manually mailed?
              </div>
              <div className="btn-group">
                <button className="btn-cancel" onClick={this.closeDialog}>
                  Cancel
                </button>
                <button
                  className="btn--light-blue"
                  onClick={this.confirmMarked.bind(this, letter._id)}
                >
                  Confirm & Marked
                </button>
              </div>
            </Dialog>
          )}
          {tagDialogIsActive && (
            <Dialog
              title="Tag Letter"
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