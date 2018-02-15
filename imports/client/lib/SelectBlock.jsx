import React, {Component} from 'react';

export default class SelectBlock extends Component {
    constructor() {
        super();
        this.state = {
            open: false
        };
        this.openSelect = this.openSelect.bind(this);
        this.nodeRef = this.nodeRef.bind(this);
        this.outsideClick = this.outsideClick.bind(this);
    }

    openSelect() {
        if(!this.state.open) {
            document.addEventListener('click', this.outsideClick, false);
        } else {
            document.removeEventListener('click', this.outsideClick, false)
        }

        this.setState({
            open: !this.state.open
        })
    }

    outsideClick(e) {
        if (this.node.contains(e.target)) {
            return;
        }

        this.openSelect();
    };

    nodeRef(node) {
        this.node = node;
    }

    render() {
        return (
            <div className={this.state.open ? "select-action open" : "select-action"} ref={this.nodeRef}>                    
                <div className="select-custom">
                    <div className="select-header" onClick={this.openSelect}>{this.props.header}</div>
                    {this.state.open ? <SelectWrapper/> : null}                    
                </div>
            </div>
        )
    }
}

class SelectWrapper extends Component {
    render() {
        return (
            <ul className="select-wrapper">
                <li>
                    <span>Theodor Spesc</span>
                </li>
                <li>
                    <span>Theodor Spesc</span>
                </li>
                <li>
                    <span>Theodor Spesc</span>
                </li>
            </ul>
        )
    }
}