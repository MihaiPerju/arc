import React, {Component} from 'react';

export default class LetterBody extends Component {
    render() {
        const {template} = this.props;
        return (
            <div className="action-block letter-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Letter body</div>
                </div>
                <div className="main__block">
                    {!!template.body && <div dangerouslySetInnerHTML={{__html: template.body}}/>}
                </div>
            </div>
        )
    }
}