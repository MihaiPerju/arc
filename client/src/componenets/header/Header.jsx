import React from "react";
import ProfileMenu from './ProfileMenu';
// ! Need to be added, when back-end hooked up - import Notifications from "./Notifications";

export default class Header extends React.PureComponent {

render() {
    return (
        <div>
            <header className="header-bar">
                <div className="header-bar__wrapper">
                    <div className="left__side flex--helper flex-align--center">
                        <img
                            className="header__logo"
                            src="./assets/img/logo.png"
                            alt=""
                        />
                    </div>
                    <ProfileMenu 
                        logOut={this.props.logOut}
                        user={this.props.user}
                    />
                </div>
            </header>
        </div>
    );
  }
}