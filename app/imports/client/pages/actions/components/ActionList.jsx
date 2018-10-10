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
      moduleTags
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
          moduleTags={moduleTags}
        />
      );
    }, this);
    return <div className={this.props.class}>{actionList}</div>;
  }
}
