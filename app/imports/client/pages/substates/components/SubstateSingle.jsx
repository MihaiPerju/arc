import React, { Component } from "react";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import actionQuery from "/imports/api/actions/queries/actionList";

export default class SubstateSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: []
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

  deleteSubstate = _id => {
    Meteor.call("substate.delete", _id, (err, res) => {
      if (!err) {
        Notifier.success("Deleted Successfully !");
      }
    });
  };

  render() {
    const { substate, substateSelected, currentSubstate } = this.props;
    const { actions } = this.state;
    const checked = substateSelected.includes(substate._id);
    const classes = classNames({
      table_row: true,
      "right-side": true,
      "bg--yellow": checked,
      open: currentSubstate === substate._id
    });

    return (
      <div className={classes}>
        <div className="table-small">
          <div className="table-cell">
            <div className="check-item">
              <input checked={checked} type="checkbox" className="hidden" />
              <label onClick={this.onSelectSubstate} />
            </div>
          </div>
        </div>
        <div className="table-small">
          <div className="table-cell">{substate.stateName}</div>
        </div>
        <div className="table-small">
          <div className="table-cell">{substate.name}</div>
        </div>
        <div className="table-small">
          <div className="table-cell">{substate.description}</div>
        </div>
        <div className="table-small">
          <div className="table-cell">
            {actions.map(action => (
              <a className="text-blue" href={"/action/" + action._id + "/edit"}>
                {action.title}
              </a>
            ))}
          </div>
        </div>
        <div className="table-small">
          <div className="table-cell">
            <button onClick={this.onSetSubstate} className="btn-text--blue">
              edit
            </button>
            <button
              onClick={() => this.deleteSubstate(substate._id)}
              className="btn-text--red"
            >
              <i className="icon-trash-o" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
