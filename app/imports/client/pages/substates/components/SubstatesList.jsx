import React, { Component } from 'react';
import SubstateSingle from './SubstateSingle';

export default class SubstatesList extends Component {
    render() {
        const { substates } = this.props;
        const substateList = substates.map((substate, index) => {
            const { setSubstate, selectSubstate, substateSelected, currentSubstate } = this.props;
            return (
                <SubstateSingle
                    substateSelected={substateSelected}
                    currentSubstate={currentSubstate}
                    selectSubstate={selectSubstate}
                    setSubstate={setSubstate}
                    substate={substate}
                    key={substate._id}
                />
            )
        });

        return (
            <div className={this.props.class}>
                {substateList}
            </div>
        );
    }
}
