import React, {Component} from "react";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import Dialog from "/imports/client/lib/ui/Dialog";
import actionQuery from "/imports/api/actions/queries/actionList";
import SubstateDescription from "./SubstateDescription";

export default class SubstateSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: [],
      dialogIsActive: false,
      selectedSubstateId: null
    };
  }

  componentWillMount() {
    const {substate} = this.props;
    this.getActions(substate.actionIds);
  }

  componentWillReceiveProps(newProps) {
    const {substate} = newProps;
    this.getActions(substate.actionIds);
  }

  getActions = actionIds => {
    actionQuery
      .clone({
        filters: {
          _id: {$in: actionIds}
        }
      })
      .fetch((err, actions) => {
        if (!err) {
          this.setState({actions});
        }
      });
  };

  onSetSubstate = () => {
    const {substate, setSubstate} = this.props;
    setSubstate(substate._id);
  };

  onSelectSubstate = e => {
    e.stopPropagation();
    const {substate, selectSubstate} = this.props;
    selectSubstate(substate._id);
  };

  deleteSubstate = () => {
    const {selectedSubstateId} = this.state;
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
      selectedSubstateId: null
    });
  };

  render() {
    const {substate, substateSelected, currentSubstate} = this.props;
    const {actions, dialogIsActive} = this.state;
    const checked = substateSelected.includes(substate._id);
    const classes = classNames('substates-table__row flex--helper', {
      "bg--yellow": checked,
      open: currentSubstate === substate._id
    });

    return (
      <div className={classes}>
        <div className="substates-field flex--helper flex-justify--center flex-align--center">
          <div className="check-item">
            <input checked={checked} type="checkbox" className="hidden"/>
            <label onClick={this.onSelectSubstate}/>
          </div>
        </div>
        <div className="substates-field flex--helper flex-justify--center flex-align--center">
          {substate.stateName}
        </div>
        <div className="substates-field flex--helper flex-justify--center flex-align--center">
          {substate.name}
        </div>
        <div className="substates-field flex--helper flex-justify--center flex-align--center">
          <span className="truncate">
            {substate.description}
          </span>
          <SubstateDescription>
            {substate.description}
          </SubstateDescription>
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
          <button onClick={this.onSetSubstate} className="btn-text--blue">
            <i className="icon-pencil"/>
          </button>
          {substate.status && (
            <button
              onClick={() => this.deleteAction(substate._id)}
              className="btn-text--red"
            >
              <i className="icon-trash-o"/>
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
      </div>
    );
  }
}
