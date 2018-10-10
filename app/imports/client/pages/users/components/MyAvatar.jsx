import React, {Component} from 'react';
import DropzoneComponent from 'react-dropzone-component';
import {getToken} from '/imports/api/uploads/utils';
import {Notifier} from '/imports/client/utils';
import {getImagePath} from '/imports/api/utils';
import PropTypes from 'prop-types';

class MyAvatar extends Component {
    constructor() {
        super();
        this.state = {
            tooltip: false
        }
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
        const componentConfig = {
            postUrl: '/uploads/avatar/' + getToken()
        };

        const djsConfig = {
            complete(file) {
                Notifier.success('Avatar added');
                this.removeFile(file);
            },
            acceptedFiles: 'image/*'
        };

        const user = this.props.user;
        const {tooltip} = this.state;

        return (
            <div className="avatar-config text-center">
                {user.avatar && user.avatar.path
                    ?
                    <div className="avatar-config__wrapper">
                        <img className="xlg-avatar img-circle" src={getImagePath(user.avatar.path)}/>
                        <a className='btn-remove'
                           onClick={this.onRemoveAvatar.bind(this)}
                           onMouseEnter={this.showTooltip}
                           onMouseLeave={this.closeTooltip}
                        >
                            <i className="icon-trash-o"/>
                        </a>
                        {
                            tooltip && <Tooltip/>
                        }
                    </div>
                    :
                    <div className="main__block">
                        <div className="add-content">
                            <i className="icon-upload"/>
                            <div className="drop-file__wrapper">
                                <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }

    onRemoveAvatar(e) {
        e.preventDefault();

        Meteor.call('users.remove_avatar', (err) => {
            if (!err) {
                Notifier.success('Avatar removed');
            }
        })
    }
}

MyAvatar.propTypes = {
    user: PropTypes.object
};

export default MyAvatar;

class Tooltip extends Component {
    render() {
        return (
            <div className="tooltip">Delete avatar</div>
        )
    }
}