import React, {Component} from 'react';
import classNames from 'classnames';

export default class CodeSingle extends Component {
    constructor(props) {
        super(props);
    }

    onSetCode() {
        const {code, setCode} = this.props;
        setCode(code._id);
    }

    onSelectCode(e) {
        e.stopPropagation();
        const {code, selectCode} = this.props;
        selectCode(code._id);
    }

    render() {
        const {code, codesSelected, currentCode} = this.props;
        const checked = codesSelected.includes(code._id);
        const classes = classNames({
            "list-item": true,
            "bg--yellow": checked,
            "open": currentCode === code._id
        });

        return (
            <div
                className={classes}
                onClick={this.onSetCode.bind(this)}>
                <div className="check-item">
                    <input checked={checked} type="checkbox" className="hidden"/>
                    <label onClick={this.onSelectCode.bind(this)}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{code.code}</div>
                </div>
            </div>
        );
    }
}