import React from "react";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/reasonCodes/queries/reasonCodesList";
import RolesEnum from "/imports/api/users/enums/roles";

class ActionContentHeader extends React.Component {
  onEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  render() {
    const { action, substates, data } = this.props;
    const substate = substates.filter(
      substate => substate._id === action.substateId
    );
    const substateName = substate[0] ? substate[0].name : "";

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
              <p>{action.description}</p>
            </div>
            <div className="text-block">
              <div className="text-light-grey text-label">Reason code</div>

              <div className="reason">
                {data.map((reason, index) => <span key={index}>{reason.reason} </span>)}
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

export default withQuery(
  props => {
    const managerId = Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)
      ? Meteor.userId()
      : null;
    const { action } = props;
    return query.clone({
      filters: {
        actionId: action._id,
        managerId
      }
    });
  },
  { reactive: true }
)(ActionContentHeader);
