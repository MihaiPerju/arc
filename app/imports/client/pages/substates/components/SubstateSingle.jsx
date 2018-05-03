import React, { Component } from 'react';
import classNames from "classnames";

export default class SubstateSingle extends Component {
    constructor(props) {
        super(props);
    }

    onSetSubstate = () => {
        const { substate, setSubstate } = this.props;
        setSubstate(substate._id);
    }

    onSelectSubstate = (e) => {
        e.stopPropagation();
        const { substate, selectSubState } = this.props;
        selectSubState(substate._id);
    }

    render() {
        const { substate, substateSelected, currentSubstate } = this.props;
        const checked = substateSelected.includes(substate._id);
        const classes = classNames({
            "list-item": true,
            "bg--yellow": checked,
            "open": currentSubstate === substate._id
        });
        return (
            <div
                onClick={this.onSetSubstate}
                className={classes}>
                <div className="check-item">
                    <input checked={checked} type="checkbox" className="hidden" />
                    <label onClick={this.onSelectSubstate}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{substate.name}</div>
                </div>
            </div>
        );
    }
}