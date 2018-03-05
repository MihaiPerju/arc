import React, {Component} from 'react';
import classNames from 'classnames';

export default class FacilityContentHeader extends Component {
    constructor() {
        super();
        this.state = {
            dropdown: false
        }
    }

    openDropdown = () => {
        const {dropdown} = this.state;
        if (!dropdown) {
            // attach/remove event handler
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }

        this.setState({
            dropdown: !dropdown
        })
    }

    handleOutsideClick = (e) => {
        // ignore clicks on the component itself
        if (this.node.contains(e.target)) {
            return;
        }

        this.openDropdown();
    }

    nodeRef = (node) => {
        this.node = node
    }

    onEditFacility = () => {
        const {onEdit} = this.props;
        onEdit();
    }

    render() {
        const {dropdown} = this.state;
        const {facility} = this.props;
        const classes = classNames({
            'dropdown': true,
            'open': dropdown
        })
        return (
            <div className="main-content__header header-block">
                <div className="row__header">
                    <div className="row__wrapper">
                        <img src="/assets/img/user.svg" className="lg-avatar-1 img-circle" alt=""/>
                        <div className="title">{facility.name}</div>
                    </div>
                    <button type="button" onClick={() => this.onEditFacility(facility)} className="btn-edit btn--white">
                        Edit facility
                    </button>
                </div>
                <ul className="row__info main-info">
                    <li className="text-center">
                        <div className="text-light-grey">Status</div>
                        <div className="info-label">{facility.status ? facility.status : "None"}</div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">First address</div>
                        <div className="info-label">
                            {facility.addressOne ? facility.addressOne : "None"}
                        </div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">Second address</div>
                        <div className="info-label">
                            {facility.addressTwo ? facility.addressTwo : "None"}
                        </div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">City</div>
                        <div className="info-label">{facility.city ? facility.city : "None"}</div>
                    </li>

                    <li className="text-center">
                        <div className="text-light-grey">State</div>
                        <div className="info-label">None</div>
                    </li>

                </ul>
                <ul className="row__info additionl-info">
                    <li className="text-center">
                        <div className="text-light-grey">Sftp Path</div>
                        <div className="info-label">{facility.sftpPath ? facility.sftpPath : "None"}</div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">Zip code</div>
                        <div className="info-label">{facility.zipCode ? facility.zipCode : "None"}</div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">Region</div>
                        <div className="info-label">None</div>
                    </li>
                    <li className="text-center toggle-allow-users" onClick={this.openDropdown} ref={this.nodeRef}>
                        <div className={classes}>
                            <div className="dropdown__header">
                                <div className="text-light-grey">Allowed users</div>
                                <div className="info-label"><span>5 users</span></div>
                            </div>
                            {
                                dropdown && <Dropdown/>
                            }
                        </div>

                    </li>
                </ul>
            </div>
        )
    }
}

class Dropdown extends Component {
    render() {
        const imgPath = '/assets/img/';
        const users = [
            {name: 'Clemy Fost', avatar: imgPath + 'user.svg'},
            {name: 'Solomon Ben', avatar: imgPath + 'user1.svg'},
            {name: 'Gimmy Pell', avatar: imgPath + 'user2.svg'},
            {name: 'Clemy Fost', avatar: imgPath + 'user.svg'}
        ]
        return (
            <div className="dropdown__wrapper">
                <ul className="allow-list">
                    {
                        users.map(function (user, index) {
                            return (
                                <li className="allow-item" key={index}>
                                    <div className="name">{user.name}</div>
                                    <img className="md-avatar img-circle" src={user.avatar} alt=""/>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="dropdown__footer">
                    <div className="btn-group">
                        <div className="btn-prev"><i className="icon-angle-left"/></div>
                        <div className="btn-next"><i className="icon-angle-right"/></div>
                    </div>
                    <div className="right--side">1-4<span className="text-light-grey"> of </span>5</div>
                </div>
            </div>
        )
    }
}