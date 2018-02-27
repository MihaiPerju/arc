import React, {Component} from 'react';

export default class ScheduleBlock extends Component {
    constructor() {
        super();
        this.state = {
            schedule: false
        }
    }

    createSchedule = () => {
        this.setState({
            schedule: true
        })
    }

    closeSchedule = () => {
        this.setState({
            schedule: false
        })
    }

    render() {
        const { schedule } = this.state;

        return (
            <div className="action-block schedule-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Schedule</div>
                </div>
                <div className="main__block">
                    <div className="add-content" onClick={this.createSchedule}>
                        <i className="icon-calendar-plus-o"/>
                        <div className="text-center">+ Add schedule</div>
                    </div>
                    {
                        schedule && <CreateSchedule close={this.closeSchedule}/>
                    }                    
                    <div className="schedule-list">
                        <div className="schedule-item">
                            <div className="left__side">
                                <div className="info">
                                    <div className="text-light-grey">Frequency</div>
                                    <div className="info-label">None</div>
                                </div>
                                <div className="info">
                                    <div className="text-light-grey">Frequency</div>
                                    <div className="info-label">None</div>
                                </div>
                            </div>
                            <div className="btn-group">
                                <button className="btn-cancel"><i className="icon-trash-o"/></button>
                                <button className="btn--blue">Sent</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class CreateSchedule extends Component {
    constructor() {
        super();
    }

    render() {
        const { close } = this.props;

        return (
            <div className="new-section">
                <div className="text-label">Create schedule</div>
                <div className="schedule-form">
                    <form action="">
                        <div className="form-wrapper">
                            <select name="" id="">
                                <option value="">Select frequency</option>
                            </select>
                        </div>
                        <div className="form-wrapper">
                            <select name="" id="">
                                <option value="">Select internal users</option>
                            </select>
                        </div>
                        <div className="btn-group">
                            <button className="btn-cancel" onClick={close}>Cancel</button>
                            <button className="btn--green">Confirm schedule</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}