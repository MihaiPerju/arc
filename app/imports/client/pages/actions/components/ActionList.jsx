import React, { Component } from "react";
import ActionSingle from "./ActionSingle";

export default class ActionList extends Component {
  constructor() {
    super();
  }

  render() {
    const {
      actions,
      setAction,
      selectAction,
      actionsSelected,
      currentAction,
      tags
    } = this.props;
    const actionList = actions.map(function(action) {
      return (
        <ActionSingle
          actionsSelected={actionsSelected}
          currentAction={currentAction}
          selectAction={selectAction}
          setAction={setAction}
          action={action}
          key={action._id}
          tags={tags}
        />
      );
    }, this);
    return <div className={this.props.class}>{actionList}</div>;
  }
}
