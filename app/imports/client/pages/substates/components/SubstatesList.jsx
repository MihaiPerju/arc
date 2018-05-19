import React, { Component } from "react";
import classNames from "classnames";

import SubstateSingle from "./SubstateSingle";

export default class SubstatesList extends Component {
  sortState = key => {
    FlowRouter.setQueryParams({ sortState: key, sortSubstate: null });
  };

  sortSubstate = key => {
    FlowRouter.setQueryParams({ sortSubstate: key, sortState: null });
  };

  render() {
    const {
      substates,
      setSubstate,
      selectSubstate,
      substateSelected,
      currentSubstate
    } = this.props;

    const state = FlowRouter.getQueryParam("sortState");
    const substate = FlowRouter.getQueryParam("sortSubstate");

    const stateAscend = classNames({
      "icon-angle-up": true,
      "state-active-asc": state && state === "ASC"
    });

    const stateDescend = classNames({
      "icon-angle-down": true,
      "state-active-desc": state && state === "DESC"
    });

    const substateAscend = classNames({
      "icon-angle-up": true,
      "substate-active-asc": substate && substate === "ASC"
    });

    const substateDescend = classNames({
      "icon-angle-down": true,
      "substate-active-desc": substate && substate === "DESC"
    });

    return (
      <div className={this.props.class}>
        <div className="table">
          <div className="theader">
            <div className="table-header text-light-grey" />
            <div className="table-header text-light-grey">
              <div>State Name</div>
              <div className="sort-icons">
                <span
                  onClick={() => this.sortState("ASC")}
                  className={stateAscend}
                />
                <span
                  onClick={() => this.sortState("DESC")}
                  className={stateDescend}
                />
              </div>
            </div>
            <div className="table-header text-light-grey">
              <div>Substate Name</div>
              <div className="sort-icons">
                <span
                  onClick={() => this.sortSubstate("ASC")}
                  className={substateAscend}
                />
                <span
                  onClick={() => this.sortSubstate("DESC")}
                  className={substateDescend}
                />
              </div>
            </div>
            <div className="table-header text-light-grey">Description</div>
            <div className="table-header text-light-grey">
              Triggering Actions
            </div>
            <div className="table-header text-light-grey">Actions</div>
          </div>
          {substates.map((substate, index) => (
            <SubstateSingle
              substateSelected={substateSelected}
              currentSubstate={currentSubstate}
              selectSubstate={selectSubstate}
              setSubstate={setSubstate}
              substate={substate}
              key={substate._id}
            />
          ))}
        </div>
      </div>
    );
  }
}
