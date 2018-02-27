import React, {Component} from 'react';

export default class PaginationBar extends Component {
    constructor() {
        super();
        this.state = {
            tooltip: false
        };
        this.showTooltip = this.showTooltip.bind(this);
        this.closeTooltip = this.closeTooltip.bind(this);
    }

    showTooltip() {
        this.setState({
            tooltip: !this.state.tooltip
        })
    }

    closeTooltip() {
        this.setState({
            tooltip: false
        })
    }

    render() {
        const {noAddButton} = this.props;
        console.log(noAddButton);
        return (
            <div className="pagination-bar">
                <div className="pagination-bar__wrapper">
                    <div className="left__side text-dark-grey">1-12 <span className="text-light-grey">of</span> 275
                    </div>
                    <div className="btn-group">
                        <button className="btn-prev"><i className="icon-angle-left"/></button>
                        <button className="btn-next"><i className="icon-angle-right"/></button>
                    </div>
                    {
                        !noAddButton &&
                        <div className="toggle-form" onMouseEnter={this.showTooltip} onMouseLeave={this.closeTooltip}>+
                        </div>
                    }
                    {this.state.tooltip && !noAddButton && <Tooltip/>}
                </div>
            </div>
        )
    }
}

class Tooltip extends Component {
    render() {
        return (
            <div className="tooltip">Add task</div>
        )
    }
}