import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import {getToken} from '/imports/api/s3-uploads/utils';
import {Notifier} from '/imports/client/utils';
import {getImagePath} from '/imports/api/utils';

class MyAvatar extends React.Component {
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

        return (
            <div className="avatar-config">
                {user.avatar && user.avatar.path
                    ?
                    <div className="avatar-config-display">
                        <img src={getImagePath(user.avatar.path)}/>
                        <a  onClick={this.onRemoveAvatar.bind(this)}>Delete Avatar</a>
                    </div>
                    : <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
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
    user: React.PropTypes.object
};

export default MyAvatar;