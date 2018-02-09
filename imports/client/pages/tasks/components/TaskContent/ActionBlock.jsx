import React, {Component} from 'react';
import NewAction from './NewAction';

export default class ActionBlock extends Component {
    constructor() {
        super();
        this.state = {
            createAction: false
        }
        this.newAction = this.newAction.bind(this);
    }

    newAction() {
        this.setState({
            createAction: !this.state.createAction
        })
    }

    render() {
        return(
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">actions</div>
                </div>
                <div className="main__block">
                    <div className="add-content" onClick={this.newAction}>
                        <i className="icon-thumb-tack"/>
                        <div className="text-center">+ Add new action</div>
                    </div>
                    { this.state.createAction ? <NewAction/> : null }                    
                    <div className="action-list">
                        <div className="action-item">
                            <div className="action-info">
                                <div className="avatar">
                                    <img className="md-avatar img-circle" src="/assets/img/user.svg" alt=""/>
                                </div>
                                <div className="info">
                                    <div className="name">Onlimen Limen Clemerson</div>
                                    <div className="text text-light-grey">Ready for work!</div>
                                </div>
                                <div className="status archived">Archived</div>
                            </div>
                            <div className="action-time">11:20 am</div>
                        </div>
                        <div className="action-item">
                            <div className="action-info">
                                <div className="avatar">
                                    <img className="md-avatar img-circle" src="/assets/img/user.svg" alt=""/>
                                </div>
                                <div className="info">
                                    <div className="name">Onlimen Limen Clemerson</div>
                                    <div className="text text-light-grey">Ready for work!</div>
                                </div>
                                <div className="status on-hold">On Hold</div>
                            </div>
                            <div className="action-time">11:20 am</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}