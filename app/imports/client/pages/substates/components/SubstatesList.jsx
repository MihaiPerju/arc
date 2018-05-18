import React, { Component } from "react";
import SubstateSingle from "./SubstateSingle";

export default class SubstatesList extends Component {
  render() {
    const {
      substates,
      setSubstate,
      selectSubstate,
      substateSelected,
      currentSubstate
    } = this.props;

    return (
      <div className={this.props.class}>
        <div className="table">
          <div className="theader">
            <div className="table-header text-light-grey" />
            <div className="table-header text-light-grey">
              <div>State Name</div>
              <div className="sort-icons">
                <span className="icon-angle-up" />
                <span className="icon-angle-down" />
              </div>
            </div>
            <div className="table-header text-light-grey">
              <div>Substate Name</div>
              <div className="sort-icons">
                <span className="icon-angle-up" />
                <span className="icon-angle-down" />
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
