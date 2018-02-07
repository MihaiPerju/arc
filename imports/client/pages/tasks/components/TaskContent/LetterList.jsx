import React, {Component} from 'react';

export default class LetterList extends Component {
    render() {
        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Letter list</div>
                </div>
                <div className="main__block">
                    <div className="add-content">
                        <i className="icon-envelope-o"/>
                        <div className="text-center">+ Create a new letter</div>
                    </div>
                </div>
            </div>
        )
    }
}