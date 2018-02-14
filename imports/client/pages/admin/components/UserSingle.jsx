import React, {Component} from 'react';

export default class UserSingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontNormal: false,
            bgYellow: false,
            open: false
        }
        this.renderContent = this.renderContent.bind(this);
        this.changeTaskBg = this.changeTaskBg.bind(this);        
    }

    renderContent() {
        this.setState({
            fontNormal: true,
            open: !this.state.open
        });
        this.props.renderContent();
    }

    render() {
        return (
            <div className="list-item" onClick={this.renderContent}>User</div>
        );
    }
}