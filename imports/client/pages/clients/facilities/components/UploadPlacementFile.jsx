import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import Notifier from '/imports/client/lib/Notifier';

export default class UploadPlacementFile extends React.Component {
    constructor() {
        super();
    }

    render() {
        const componentConfig = {
            postUrl: '/uploads/csv'
        };

        const djsConfig = {
            complete(file) {
                Notifier.success('Added');
                this.removeFile(file);
            }
        };
        return (<div>
            <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
        </div>)
    }
}
