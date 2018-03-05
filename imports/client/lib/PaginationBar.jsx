import React, {Component} from 'react';

export default class PaginationBar extends Component {
    constructor() {
        super();
        this.state = {
            tooltip: false
        };
    }

    onNextPage(inc) {
        const {nextPage} = this.props;
        nextPage(inc);
    }

    showTooltip = () => {
        this.setState({
            tooltip: !this.state.tooltip
        })
    };

    closeTooltip = () => {
        this.setState({
            tooltip: false
        })
    };

    render() {
        const {tooltip} = this.state;
        const {create, module, total, range} = this.props;

        return (
            <div className="pagination-bar">
                <div className="pagination-bar__wrapper">
                    <div
                        className="left__side text-dark-grey">{range && range.lowest ? range.lowest : 0} - {range && range.highest ? range.highest : 0}
                        <span className="text-light-grey"> of </span>
                        {total ? total : 0}
                    </div>
                    <div className="btn-group">
                        <button onClick={this.onNextPage.bind(this, -1)} className="btn-prev"><i
                            className="icon-angle-left"/></button>
                        <button onClick={this.onNextPage.bind(this, 1)} className="btn-next"><i
                            className="icon-angle-right"/></button>
                    </div>
                    <div className="toggle-form" onClick={create} onMouseEnter={this.showTooltip}
                         onMouseLeave={this.closeTooltip}>+
                    </div>
                    {tooltip && <Tooltip module={module}/>}
                </div>
            </div>
        )
    }
}

class Tooltip extends Component {
    render() {
        const {module} = this.props;
        return (
            <div className="tooltip">Add {module && module}</div>
        )
    }
}