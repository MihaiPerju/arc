import React, {Component} from 'react';

export default class RegionContent extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="main-content">
                <div className="main-content__wrapper">
                    <i className="icon-thumb-tack"/>
                    <div className="text-light-grey">Action name</div>
                    <div className="name">Archived</div>
                </div>
                <div className="info-block">
                    <div className="left__side">
                        <div className="text-light-grey">Substate</div>
                        <div className="">Peding payment</div>
                    </div>
                    <div className="right__side">
                        <div className="text-light-grey">Substate</div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum reprehenderit sunt quis, 
                        laboriosam sit error ad libero enim, ullam pariatur voluptas porro labore asperiores 
                        ratione ipsa doloremque facere, dolorum praesentium.</p>
                    </div>
                </div>         
            </div>
        )
    }
}