import React, { Component } from 'react';
import NewAction from './NewAction';
import moment from 'moment';

export default class ActionBlock extends Component {
    constructor () {
        super();
        this.state = {
            createAction: false
        },
            this.newAction = this.newAction.bind(this);
    }

    newAction () {
        const {createAction} = this.state;
        this.setState({
            createAction: !createAction
        });
    }

    render () {
        const {account} = this.props;
        const actionsPerformed = account.actions;
        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">actions</div>
                </div>
                <div className="main__block">
                    <div className="add-content" onClick={this.newAction}>
                        <i className="icon-thumb-tack"/>
                        <div className="text-center">+ Add new action</div>
                    </div>
                    {this.state.createAction ? <NewAction hide={this.newAction} account={account}/> : null}
                    <div className="action-list">
                        {
                            actionsPerformed &&
                            actionsPerformed.sort((a, b) => a.createdAt < b.createdAt).map((actionPerformed, key) => (
                                (
                                    <div className="action-item" key={key}>
                                        <div className="action-info">
                                            <div className="avatar">
                                                <img className="md-avatar img-circle" src="/assets/img/user.svg"
                                                     alt=""/>
                                            </div>
                                            <div className="info">
                                                <div className="name">Author(TBM)</div>
                                                <div className="text text-light-grey">
                                                    <b>{actionPerformed.reasonCode}</b>:
                                                    {actionPerformed.action && actionPerformed.action.title}
                                                </div>
                                            </div>
                                            <div className="status archived">{actionPerformed.action && actionPerformed.action.status}</div>
                                        </div>
                                        <div className="action-time">
                                            {moment(actionPerformed.action && actionPerformed.action.createdAt).format('hh:mm')}
                                        </div>
                                    </div>
                                )
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}