import React, { Component } from 'react';

export default class SubstateHeader extends Component {

    onEditSubstate = () => {
        const { onEdit } = this.props;
        onEdit();
    }

    render() {
        const { substate } = this.props;
        return (
            <div className="main-content__header header-block">
                <div className="row__header">
                    <div className="text-light-grey">Substate name</div>
                    <div className="title">{substate.name}</div>
                </div>
                <div className="row__header">
                    <div className="plasment-block">
                        <div className="text-light-grey">State name</div>
                        <div className="type">{substate.stateName}</div>
                    </div>
                    <div className="btn-group">
                        <button onClick={() => this.onEditSubstate(substate)} className="btn--white">
                            Edit substate
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}