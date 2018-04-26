import React, { Component } from 'react';

export default class SubStateHeader extends Component {

    onEditSubState = () => {
        const { onEdit } = this.props;
        onEdit();
    }

    render() {
        const { subState } = this.props;
        return (
            <div className="main-content__header header-block">
                <div className="row__header">
                    <div className="text-light-grey">Sub state name</div>
                    <div className="title">{subState.name}</div>
                </div>
                <div className="row__header">
                    <div className="plasment-block">
                        <div className="text-light-grey">State name</div>
                        <div className="type">{subState.stateName}</div>
                    </div>
                    <div className="btn-group">
                        <button onClick={() => this.onEditSubState(subState)} className="btn--white">
                            Edit sub state
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}