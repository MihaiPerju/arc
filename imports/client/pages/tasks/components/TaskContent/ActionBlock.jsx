import React, {Component} from 'react';

export default class ActionBlock extends Component {
    render() {
        return(
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">actions</div>
                </div>
                <div className="main__block">
                    <div className="add-content">
                        <i className="icon-thumb-tack"/>
                        <div className="text-center">+ Add new action</div>
                    </div>
                    <div className="new-action">
                        <div className="action-info">
                            <img className="md-avatar img-circle" src="/assets/img/user1.svg" alt=""/>
                            <div className="name">Solomon Ben</div>
                        </div>
                        <form action="">
                            <div className="select-action">
                                <span>Select action</span>
                            </div>
                            <div className="form-group">
                                <input type="text" placeholder="Note"/>
                            </div>
                            <div className="btn-group">
                                <button className="btn--red">Cancel</button>
                                <button className="btn--green">Save</button>
                            </div>
                        </form>
                    </div>
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