import React, {Component} from 'react';

export default class LetterTemplateHeader extends Component {
    render() {
        const {template} = this.props;
        return (
            <div className="main-content__header header-block">
                <div className="row__header">
                    <div className="text-light-grey">Letter name</div>
                    <div className="title">{template.name}</div>
                </div>
                <div className="row__header">
                    <div className="plasment-block">
                        <div className="text-light-grey">Category</div>
                        <div className="type">{template.category}</div>
                    </div>
                    <div className="btn-group">
                        <button className="btn--white">Edit lettter</button>
                    </div>
                </div>
            </div>
        )
    }
}