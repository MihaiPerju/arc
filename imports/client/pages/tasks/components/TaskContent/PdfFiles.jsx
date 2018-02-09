import React, {Component} from 'react';

export default class ActionBlock extends Component {
    render() {
        return(
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">pdf files</div>
                </div>
                <div className="main__block">
                    <div className="btn-group-1">
                        <div className="add-content">
                            <i className="icon-file-pdf-o"/>
                            <div className="text-center">+ Add or drop new files</div>
                        </div>
                        <button className="btn-download">
                            <span className="text-dark-grey">Download all</span>
                        </button>
                    </div>
                    <div className="block-list file-list">
                        <div className="block-item">
                            <div className="info">
                                <div className="title">lemerstont.pdf</div>
                            </div>
                            <div className="btn-group">
                                <button className="btn-text--blue"><i className="icon-download"/></button>
                                <button className="btn-text--red"><i className="icon-trash-o"/></button>
                                <button className="btn--blue">View</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}