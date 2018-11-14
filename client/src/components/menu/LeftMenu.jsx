import React from "react";
import Menu from "./Menu";
import menuItems from './menuItems';

export default class LeftMenu extends React.Component {
    constructor() {
        super();
        this.state = {
            collapse: false
        };
    }
    
    collapseMenu = () => {
        this.setState({collapse: !this.state.collapse});
    };
    
    render() {
        const menuClass = this.state.collapse ? 'collapsed' : '';

        return (
            <div className={`left-menu ${menuClass}`}>
                <Menu menuItems={menuItems} role={this.props.user.role}/>
                <div className="btn-collapse text-center" onClick={this.collapseMenu}>
                    <i className="icon-angle-left" />
                </div>
            </div>
        )
    }
}