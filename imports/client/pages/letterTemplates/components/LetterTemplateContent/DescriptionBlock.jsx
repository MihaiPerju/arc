import React, {Component} from 'react';

export default class DescriptionBlock extends Component {
    render() {
        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Description</div>
                </div>
                <div className="description-block">
                    <p className="text-light-grey">Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                    Sequi itaque veritatis perspiciatis repudiandae libero sed earum, ex. 
                    Modi aspernatur praesentium necessitatibus, minima in quas velit eum quod obcaecati 
                    sunt! Quasi?</p>
                </div>
            </div>
        )
    }
}