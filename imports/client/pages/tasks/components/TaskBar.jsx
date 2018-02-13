import React, {Component} from 'react';

export default class TaskBar extends Component {
    constructor() {
        super();
        this.state = {
            active: false
        }
        this.renderFilterBar = this.renderFilterBar.bind(this);
    }

    renderFilterBar() {
        this.setState({
            active: !this.state.active
        });
        this.props.filter();
    }

    render() {
        return (
            <div className="task-bar">
                <div className="select-type">
                    <div className="btn-select"></div>
                </div>
                { this.props.btnGroup ? <BtnGroup/> : null }
                <form action="" className={this.props.btnGroup ? "search-task" : "search-task full__width"}>
                    <div className="form-group">
                        <input type="text" placeholder="&#xf002;  Search" />
                    </div>
                </form>
                <div className={this.state.active ? "filter-block active" : "filter-block"} onClick={this.renderFilterBar}>
                    <button><i className="icon-filter"/></button>
                </div>
            </div>
        )
    }
}

class BtnGroup extends Component {
    constructor() {
        super();
        this.state = {
            in: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({in: true});
        }, 1);
    }

    render() {
        return (
            <div className={this.state.in ? "btn-group in" : "btn-group"}>
                <button><i className="icon-archive"/></button>
                <button><i className="icon-trash-o"/></button>
            </div>
        )
    }
}