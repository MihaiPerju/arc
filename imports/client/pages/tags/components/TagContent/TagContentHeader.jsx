import React, {Component} from 'react';

export default class TagContentHeader extends Component {
    onEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    render() {
        const {tag} = this.props;
        return (
            <div className="main-content action-content">
                <div className="main-content__wrapper">
                    <div className="intro-block text-center">
                        <div className="intro-block__wrapper">
                            <i className="icon-paperclip"/>
                            <div className="text-light-grey">Tag name</div>
                            <div className="action-name">{tag.name}</div>
                        </div>
                    </div>
                    <button onClick={this.onEdit} className="btn-edit btn--white">Edit Tag</button>
                </div>
            </div>
        )
    }
}