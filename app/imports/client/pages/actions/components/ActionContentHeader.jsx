import React from "react";
import RolesEnum from "/imports/api/users/enums/roles";
import Notifier from "../../../lib/Notifier";

export default class ActionContentHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      reasonCodes: []
    };
  }

  componentWillMount() {
    const managerId = Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)
      ? Meteor.userId()
      : null;
    const { action } = this.props;

    let filters = {
      actionId: action._id,
      managerId
    };

    Meteor.call("reasonCodes.get", filters, (err, reasonCodes) => {
      if (!err) {
        this.setState({ reasonCodes });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  render() {
    const { action, substates } = this.props;
    const { reasonCodes } = this.state;
    const substate =
      action &&
      substates.filter(substate => substate._id === action.substateId);
    const substateName =
      substate && substate[0] ? substate[0].name : "No substate";
    
    return (
      <div className="main-content action-content">
        <div className="main-content__wrapper">
          <div className="intro-block text-center">
            <div className="intro-block__wrapper">
              <i className="icon-thumb-tack" />
              <div className="text-light-grey">Action name</div>
              <div className="action-name">{action.title}</div>
            </div>
          </div>
          <div className="info-block">
            <div className="text-block">
              <div className="text-light-grey text-label">Substate</div>
              <div className="status">{substateName}</div>
            </div>
            <div className="text-block">
              <div className="text-light-grey text-label">Description</div>
              <p>{action.description || "No description"}</p>
            </div>
            <div className="text-block">
              <div className="text-light-grey text-label">Reason Codes</div>

              <div className="reason">
                {reasonCodes.length
                  ? reasonCodes.map((reason, index) => (
                      <span key={index}>
                        {reason.reason}
                        {index !== reasonCodes.length - 1 ? "," : ""}{" "}
                      </span>
                    ))
                  : "No Reason codes"}
              </div>
            </div>
          </div>
          <button onClick={this.onEdit} className="btn-edit btn--white">
            Edit action
          </button>
        </div>
      </div>
    );
  }
}
