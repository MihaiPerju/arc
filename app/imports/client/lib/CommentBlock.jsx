import React, {Component} from 'react';
import CommentsListContainer from '/imports/client/pages/comments/CommentsListContainer';

export default class LetterList extends Component {
    render() {
        const {account} = this.props;
        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Comments</div>
                </div>
                <CommentsListContainer accountId={account}/>
            </div>
        )
    }
}