import React from 'react';

class ProfileMenu extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            isOpen: false
        }

        this.node = null;
    }

    // TODO: Move this to a normal icon on menu bar not in user menu
    renderSettings = () => {
        if(this.props.user.role !== 'Admin')
            return null;

        return (
            <a href="/admin/settings">
                <i className="icon-cog" />
                <span>Settings</span>
            </a>
        )
    }

    renderMenu = () => {
        return (
        <div className="btn-group">
            {this.renderSettings()}
            <a onClick={this.props.logOut} href="#">
                <i className="icon-sign-out" />
                <span>Log out</span>
            </a>
        </div>
        )
    }

    nodeRef = (node) => {
        this.node = node;
    };

    outsideClick = (event) => {
        console.log(event)
        if (this.node.contains(event.target)) {
          return;
        }
    
        this.openMenu();
    };

    openMenu = () => {
        if (!this.state.isOpen) {
          document.addEventListener("click", this.outsideClick, false);
        } else {
          document.removeEventListener("click", this.outsideClick, false);
        }
    
        this.setState({
            isOpen: !this.state.isOpen
        });
      };
    
    render() {
        const cssClass = this.state.isOpen ? "open" : ""

        return (
            <div className={`right__side ${cssClass}`}>
                <div className="owner-menu">
                    <div
                        className="toggle-dropdown"
                        onClick={this.openMenu}
                        ref={this.nodeRef}
                    >
                        <span>
                            {`${this.props.user.firstName} ${this.props.user.lastName}`}
                        </span>
                    </div>
                </div>
                {this.state.isOpen && this.renderMenu()}
            </div>
        );
    }
}

export default ProfileMenu