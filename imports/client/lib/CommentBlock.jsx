import React, {Component} from 'react';

export default class LetterList extends Component {
    render() {
        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Comments</div>
                </div>               
                <form action="" className="comment-block">
                    <div className="form-group">
                        <img className="md-avatar img-circle" src="/assets/img/user.svg" alt=""/>                          
                        <div contentEditable="true" className="text-area" placeholder="Leave you comment"></div>
                        <button className="btn-post">Post</button>
                    </div>
                </form>
                <div className="comment-list">
                    <div className="comment-item">
                        <div className="comment__wrapper">
                            <img className="md-avatar img-circle" src="/assets/img/user.svg" alt=""/>
                            <div className="name">Beneon Dream</div>
                            <div className="message text-light-grey">Everything looks ready for work dont forget that!</div>
                        </div>
                        <div className="time">11:20</div>
                    </div>
                </div>
            </div>
        )
    }
}