import React, { Component } from 'react';
import SubStateSingle from './SubStateSingle';

export default class SubStatesList extends Component {
    render() {
        const { subStates } = this.props;
        const subStateList = subStates.map((subState, index) => {
            const { setSubState, selectSubState, subStateSelected, currentSubState } = this.props;
            return (
                <SubStateSingle
                    subStateSelected={subStateSelected}
                    currentSubState={currentSubState}
                    selectSubState={selectSubState}
                    setSubState={setSubState}
                    subState={subState}
                    key={subState._id}
                />
            )
        });

        return (
            <div className={this.props.class}>
                {subStateList}
            </div>
        );
    }
}
