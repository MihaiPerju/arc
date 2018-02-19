import React, {Component} from 'react';
import NewAction from './NewAction';
import moment from 'moment';

export default class ActionBlock extends Component {
    constructor() {
        super();
        this.state = {
            createAction: false
        },
            this.newAction = this.newAction.bind(this);
    }

    newAction() {
        const {createAction} = this.state;
        this.setState({
            createAction: !createAction
        })
    }

    render() {
        const {task,update} = this.props;
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
                    {this.state.createAction ? <NewAction update={update}  hide={this.newAction} task={task}/> : null}
                    <div className="action-list">
                        {
                            task.actionsLinkData &&
                            task.actionsLinkData.sort((a, b) => a.createdAt < b.createdAt).map((action, key) => (
                                (
                                    <div className="action-item" key={key}>
                                        <div className="action-info">
                                            <div className="avatar">
                                                <img className="md-avatar img-circle" src="/assets/img/user.svg"
                                                     alt=""/>
                                            </div>
                                            <div className="info">
                                                <div className="name">Author(TBM)</div>
                                                <div className="text text-light-grey">{action.title}</div>
                                            </div>
                                            <div className="status archived">{action.status}</div>
                                        </div>
                                        <div className="action-time">{moment(action.createdAt).format('hh:mm')}</div>
                                    </div>
                                )
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}