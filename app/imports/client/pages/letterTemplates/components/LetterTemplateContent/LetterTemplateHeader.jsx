import React, {Component} from 'react';

export default class LetterTemplateHeader extends Component {

    onEditTemplate = () => {
        const {onEdit} = this.props;
        onEdit();
    }

    render() {
        const {template} = this.props;
        return (
            <div className="main-content__header header-block">
                <div className="row__header">
                    <div className="text-light-grey">Letter name</div>
                    <div className="title">{template.name}</div>
                </div>
                <div className="row__header">
                    <div className="placement-block">
                        <div className="text-light-grey">Category</div>
                        <div className="type">{template.category}</div>
                    </div>
                    <div className="btn-group">
                        <button onClick={() => this.onEditTemplate(template)} className="btn--white">
                            Edit letter
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}