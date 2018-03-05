import React from 'react';

export default class ActionContentHeader extends React.Component {

    onEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    render() {
        const {action} = this.props;
        return (
            <div className="main-content action-content">
                <div className="main-content__wrapper">
                    <div className="intro-block text-center">
                        <div className="intro-block__wrapper">
                            <i className="icon-thumb-tack"/>
                            <div className="text-light-grey">Action name</div>
                            <div className="action-name">{action.title}</div>
                        </div>
                    </div>
                    <div className="info-block">
                        <div className="left-side">
                            <div className="text-light-grey">Substate</div>
                            <div className="status">{action.substate}</div>
                        </div>
                        <div className="right-side">
                            <div className="text-light-grey">Description</div>
                            <p>{action.description}</p>
                        </div>
                    </div>
                    <button onClick={this.onEdit} className="btn-edit btn--white">Edit action</button>
                </div>
            </div>
        )
    }
}