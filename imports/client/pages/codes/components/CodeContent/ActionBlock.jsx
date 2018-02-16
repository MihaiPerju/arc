import React, {Component} from 'react';
import NewAction from './NewAction';

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
                    {this.state.createAction ? <NewAction hide={this.newAction}/> : null}
                    <div className="action-list">
                        <div className="action-item">
                            <div className="action-info">
                                <div className="avatar">
                                    <img className="md-avatar img-circle" src="/assets/img/user.svg"
                                         alt=""/>
                                </div>
                                <div className="info">
                                    <div className="name">Author(TBM)</div>
                                    <div className="text text-light-grey">asdasdasd</div>
                                </div>
                                <div className="status archived">hold</div>
                            </div>
                            <div className="action-time">18:20</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}