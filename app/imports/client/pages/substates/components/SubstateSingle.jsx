import React, { Component } from 'react';
import classNames from "classnames";
import Notifier from '/imports/client/lib/Notifier';

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
        const { substate, selectSubstate } = this.props;
        selectSubstate(substate._id);
    }

    deleteSubstate = (_id) => {
        Meteor.call('substate.delete', _id, (err, res) => {
            if(!err) {
                Notifier.success('Deleted Successfully !');
            }
        })
    }

    render() {
        const { substate, substateSelected, currentSubstate } = this.props;
        const checked = substateSelected.includes(substate._id);
        const classes = classNames({
            "right-side": true,
            "bg--yellow": checked,
            "open": currentSubstate === substate._id
        });

        return (
            <div className="table-row">
                <div className={classes}>
                    <div className="table-field text-center">
                        <div className="check-item">
                            <input checked={checked} type="checkbox" className="hidden" />
                            <label onClick={this.onSelectSubstate}></label>
                        </div>
                    </div>
                    <div className="table-field text-center">{substate.stateName}</div>
                    <div className="table-field text-center">
                        {substate.name}
                    </div>
                    <div className="table-field text-center">{substate.description}</div>
                    <div className="table-field text-center">
                        <a href="">Action 1</a>
                        <a href="">Action 2</a>
                    </div>
                    <div className="table-field text-center">
                        <button onClick={this.onSetSubstate} className="btn-text--blue">edit</button>
                        <button onClick={() => this.deleteSubstate(substate._id)} className="btn-text--red"><i className="icon-trash-o"></i></button>
                    </div>
                </div>
            </div>
        );
    }
}