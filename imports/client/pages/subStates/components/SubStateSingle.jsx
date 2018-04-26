import React, { Component } from 'react';
import classNames from "classnames";

export default class SubStateSingle extends Component {
    constructor(props) {
        super(props);
    }

    onSetSubState = () => {
        const { subState, setSubState } = this.props;
        setSubState(subState._id);
    }

    onSelectSubState = (e) => {
        e.stopPropagation();
        const { subState, selectSubState } = this.props;
        selectSubState(subState._id);
    }

    render() {
        const { subState, subStateSelected, currentSubState } = this.props;
        const checked = subStateSelected.includes(subState._id);
        const classes = classNames({
            "list-item": true,
            "bg--yellow": checked,
            "open": currentSubState === subState._id
        });
        return (
            <div
                onClick={this.onSetSubState}
                className={classes}>
                <div className="check-item">
                    <input checked={checked} type="checkbox" className="hidden" />
                    <label onClick={this.onSelectSubState}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{subState.name}</div>
                </div>
            </div>
        );
    }
}