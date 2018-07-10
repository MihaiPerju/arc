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
        <div className="substates-table">
          <div className="substates-table__wrapper">
            <div className="substates-table__header flex--helper">
              <div className="substates-field" />
              <div className="substates-field substates-sort flex--helper flex-justify--center flex-align--center text-light-grey">
                <button className="btn-text--green" onClick={() => this.sortState("ASC")}>
                  <i className={stateAscend}/>
                </button>
                <span>State Name</span>
                <button className="btn-text--green" onClick={() => this.sortState("DESC")}>
                  <i className={stateDescend}/>
                </button>
              </div>
              <div className="substates-field substates-sort flex--helper flex-justify--center flex-align--center text-light-grey">
                <button className="btn-text--green" onClick={() => this.sortSubstate("ASC")}>
                  <i className={substateAscend}/>
                </button>
                <span>Substate Name</span>
                <button className="btn-text--green" onClick={() => this.sortSubstate("DESC")}>
                  <i className={substateDescend}/>
                </button>
              </div>
              <div className="substates-field flex--helper flex-justify--center flex-align--center text-light-grey">Description</div>
              <div className="substates-field flex--helper flex-justify--center flex-align--center text-light-grey">
                Triggering Actions
              </div>
              <div className="substates-field flex--helper flex-justify--center flex-align--center text-light-grey">
                Status
              </div>
              <div className="substates-field flex--helper flex-justify--center flex-align--center text-light-grey">Actions</div>
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
      </div>
    );
  }
}
