import React, {Component} from 'react';

export default class DescriptionBlock extends Component {
    render() {
        const {template} = this.props;
        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Description</div>
                </div>
                <div className="description-block">
                    <p className="text-light-grey">{template.description}</p>
            </div>
    </div>)
    }
}