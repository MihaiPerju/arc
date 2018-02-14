import React, {Component} from 'react';

export default class UserContent extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="main-content action-content">
                <div className="main-content__wrapper">
                    <div className="intro-block text-center">
                        <div className="intro-block__wrapper">
                            <i className="icon-thumb-tack"/>
                            <div className="text-light-grey">Action name</div>
                            <div className="action-name">Archived</div>
                        </div>
                    </div>
                    <div className="info-block">
                        <div className="left-side">
                            <div className="text-light-grey">Substate</div>
                            <div className="status">Peding payment</div>
                        </div>
                        <div className="right-side">
                            <div className="text-light-grey">Description</div>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum reprehenderit sunt quis, 
                            laboriosam sit error ad libero enim, ullam pariatur voluptas porro labore asperiores 
                            ratione ipsa doloremque facere, dolorum praesentium.</p>
                        </div>
                    </div>
                    <button className="btn-edit btn--white">Edit action</button>         
                </div>
            </div>
        )
    }
}