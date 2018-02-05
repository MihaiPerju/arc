import React, {Component} from 'react';

export default class TaskSingle extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="task-item">
                <div className="check-task">
                    <input type="checkbox" id="11" className="hidden"/>
                    <label htmlFor="11"></label>
                </div>
                <div className="mark-task">
                    <input type="checkbox" id="1" className="hidden"/>
                    <label htmlFor="1"></label>
                </div>
                <div className="row__item">
                    <div className="left__side">
                        <div className="person">Solomon Ben</div>
                    </div>
                    <div className="right__side">
                        <div className="pacient-id text-blue">MBG981828112</div>
                        <div className="financial-class">O/D</div>
                        <div className="time">11:20 am</div>
                    </div>
                </div>
                <div className="row__item">
                    <div className="price">18,586</div>
                    <div className="location">New York-Presbyterian University Hospital</div>
                </div>
            </div>
        );
    }
}