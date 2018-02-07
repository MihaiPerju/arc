import React, {Component} from 'react';

export default class ActionBlock extends Component {
    render() {
        return(
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">pdf files</div>
                </div>
                <div className="main__block">
                    <div className="add-content">
                        <i className="icon-file-pdf-o"/>
                        <div className="text-center">+ Add or drop new files</div>
                    </div>
                </div>
            </div>
        )
    }
}