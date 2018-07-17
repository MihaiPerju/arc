import React, { Component } from "react";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import Dialog from "/imports/client/lib/ui/Dialog";
import actionQuery from "/imports/api/actions/queries/actionList";
import SubstateDescription from "./SubstateDescription";
import SimpleSchema from "simpl-schema";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import { AutoForm, ErrorField } from "/imports/ui/forms";

export default class SubstateSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: [],
      dialogIsActive: false,
      selectedSubstateId: null,
      tagDialogIsActive: false
    };
  }

  componentWillMount() {
    const { substate } = this.props;
    this.getActions(substate.actionIds);
  }

  componentWillReceiveProps(newProps) {
    const { substate } = newProps;
    this.getActions(substate.actionIds);
  }

  getActions = actionIds => {
    actionQuery
      .clone({
        filters: {
          _id: { $in: actionIds }
        }
      })
      .fetch((err, actions) => {
        if (!err) {
          this.setState({ actions });
        }
      });
  };

  onSetSubstate = () => {
    const { substate, setSubstate } = this.props;
    setSubstate(substate._id);
  };

  onSelectSubstate = e => {
    e.stopPropagation();
    const { substate, selectSubstate } = this.props;
    selectSubstate(substate._id);
  };

  deleteSubstate = () => {
    const { selectedSubstateId } = this.state;
    Meteor.call("substate.delete", selectedSubstateId, (err, res) => {
      if (!err) {
        Notifier.success("Deleted Successfully !");
      }
      this.closeDialog();
    });
  };

  deleteAction = id => {
    this.setState({
      dialogIsActive: true,
      selectedSubstateId: id
    });
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false,
      selectedSubstateId: null,
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
    const { _id } = this.props.substate;
    Object.assign(data, { _id });

    Meteor.call("substate.tag", data, err => {
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
      substate,
      substateSelected,
      currentSubstate,
      moduleTags
    } = this.props;
    const { actions, dialogIsActive, tagDialogIsActive } = this.state;
    const checked = substateSelected.includes(substate._id);
    const classes = classNames("substates-table__row flex--helper", {
      "bg--yellow": checked,
      open: currentSubstate === substate._id
    });

    const options = this.getOptions(moduleTags);
    const model = {
      tagIds: substate.tagIds
    };

    return (
      <div className={classes}>
        <div className="substates-field flex--helper flex-justify--center flex-align--center">
          <div className="check-item">
            <input checked={checked} type="checkbox" className="hidden" />
            <label onClick={this.onSelectSubstate} />
          </div>
        </div>
        <div className="substates-field flex--helper flex-justify--center flex-align--center">
          {substate.stateName}
        </div>
        <div className="substates-field flex--helper flex-justify--center flex-align--center">
          {substate.name}
        </div>
        <div className="substates-field flex--helper flex-justify--center flex-align--center">
          <span className="truncate">{substate.description}</span>
          <SubstateDescription>{substate.description}</SubstateDescription>
        </div>
        <div className="substates-field flex--helper flex-justify--center flex-align--center">
          {actions.map((action, index) => (
            <a
              key={index}
              className="text-blue truncate"
              href={"/action/" + action._id + "/edit"}
            >
              {action.title}
            </a>
          ))}
          {actions.length === 0 && "-"}
        </div>
        <div className="substates-field flex--helper flex-justify--center flex-align--center">
          {substate.status ? "Active" : "In-Active"}
        </div>
        <div className="substates-field text-center">
          <a style={{float: "left"}} onClick={this.onhandleTag.bind(this)}>
            <img
              style={{ width: "16px", margin: "8px" }}
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDIyIDI0Ij48cGF0aCBkPSJNMTkuNSAxNi4yODZxMC0uNTM2LS4zNzUtLjkxbC0yLjc4Ni0yLjc4N3EtLjM3Ni0uMzc2LS45MTItLjM3Ni0uNTYzIDAtLjk2NC40M2wuMjU0LjI0N3EuMjE0LjIwOC4yODguMjl0LjIuMjUzLjE3NS4zNDIuMDQ4LjM2OHEwIC41MzYtLjM3NS45MXQtLjkxLjM3NnEtLjIwMiAwLS4zNy0uMDQ4dC0uMzQtLjE3NC0uMjU1LS4yLS4yODgtLjI5LS4yNDgtLjI1M3EtLjQ0Mi40MTUtLjQ0Mi45NzggMCAuNTM2LjM3NS45MWwyLjc2IDIuNzczcS4zNi4zNjIuOTEuMzYyLjUzNiAwIC45MS0uMzQ4bDEuOTctMS45NTVxLjM3NS0uMzc1LjM3NS0uODk3em0tOS40MTUtOS40NDJxMC0uNTM2LS4zNzUtLjkxTDYuOTUgMy4xNnEtLjM3NC0uMzc0LS45MS0uMzc0LS41MjIgMC0uOTEuMzYyTDMuMTYgNS4xMDNxLS4zNzUuMzc1LS4zNzUuODk3IDAgLjUzNi4zNzUuOTFsMi43ODYgMi43ODdxLjM2Mi4zNjIuOTEuMzYyLjU2NCAwIC45NjUtLjQxNmwtLjI1My0uMjQ4cS0uMjEzLS4yMDgtLjI4OC0uMjg4dC0uMjAyLS4yNTQtLjE3NC0uMzQyLS4wNDctLjM2OHEwLS41MzYuMzc1LS45MXQuOTEtLjM3NnEuMjAyIDAgLjM3LjA0N3QuMzQuMTc0LjI1NS4yLjI4OC4yODguMjQ4LjI1NHEuNDQyLS40MTUuNDQyLS45Nzh6bTExLjk4NiA5LjQ0MnEwIDEuNjA3LTEuMTM3IDIuNzJsLTEuOTcgMS45NTRxLTEuMTEgMS4xMTItMi43MTggMS4xMTItMS42MiAwLTIuNzMyLTEuMTM4bC0yLjc2LTIuNzcycS0xLjExLTEuMTEyLTEuMTEtMi43MiAwLTEuNjQ2IDEuMTc4LTIuNzk4bC0xLjE3OC0xLjE4cS0xLjE1MiAxLjE4LTIuNzg2IDEuMTgtMS42MDcgMC0yLjczMi0xLjEyNUwxLjMzOCA4LjczMlEuMjEzIDcuNjA4LjIxMyA2VDEuMzUgMy4yODNsMS45Ny0xLjk1NVE0LjQzMi4yMTUgNi4wNC4yMTVxMS42MiAwIDIuNzMgMS4xMzhsMi43NiAyLjc3MnExLjExMiAxLjExMiAxLjExMiAyLjcyIDAgMS42NDYtMS4xOCAyLjc5OGwxLjE4IDEuMThxMS4xNTItMS4xOCAyLjc4Ni0xLjE4IDEuNjA3IDAgMi43MzIgMS4xMjVsMi43ODYgMi43ODZxMS4xMjUgMS4xMjUgMS4xMjUgMi43MzJ6Ii8+PC9zdmc+"
              alt=""
            />
          </a>
          <button onClick={this.onSetSubstate} className="btn-text--blue">
            <i className="icon-pencil" />
          </button>
          {substate.status && (
            <button
              onClick={() => this.deleteAction(substate._id)}
              className="btn-text--red"
            >
              <i className="icon-trash-o" />
            </button>
          )}
        </div>
        {dialogIsActive && (
          <Dialog className="account-dialog" closePortal={this.closeDialog}>
            <div className="form-wrapper">
              Are you sure you want to delete selected items ?
            </div>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button
                className="btn--light-blue"
                onClick={() => this.deleteSubstate()}
              >
                Confirm & delete
              </button>
            </div>
          </Dialog>
        )}
        {tagDialogIsActive && (
          <Dialog
            title="Tag Substate"
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
