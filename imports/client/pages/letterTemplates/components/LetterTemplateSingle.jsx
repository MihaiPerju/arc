import React, {Component} from 'react';
import classNames from "classnames";

export default class LetterTemplateSingle extends Component {
    constructor(props) {
        super(props);
    }

    onSetTemplate() {
        const {template, setTemplate} = this.props;
        setTemplate(template._id);
    }

    onSelectTemplate(e) {
        e.stopPropagation();
        const {template, selectTemplate} = this.props;
        selectTemplate(template._id);
    }

    render() {
        const {template, templatesSelected, currentTemplate} = this.props;
        const checked = templatesSelected.includes(template._id);
        const classes = classNames({
            "list-item": true,
            "bg--yellow": checked,
            "open": currentTemplate === template._id
        });
        return (
            <div
                onClick={this.onSetTemplate.bind(this)}
                className={classes}>
                <div className="check-item">
                    <input checked={checked} type="checkbox" className="hidden"/>
                    <label onClick={this.onSelectTemplate.bind(this)}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{template.name}</div>
                </div>
            </div>
        );
    }
}