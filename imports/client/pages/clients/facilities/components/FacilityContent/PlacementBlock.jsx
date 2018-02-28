import React, {Component} from 'react';
import UploadItem from './UploadItem';
import Notifier from "../../../../../lib/Notifier";
import DropzoneComponent from 'react-dropzone-component';
import ImportingRules from '../ImportingRules';

export default class PlacementBlock extends Component {
    render() {
        const {facility} = this.props;
        const componentConfig = {
            postUrl: `/uploads/csv/${facility._id}`
        };

        const djsConfig = {
            complete(file) {
                Notifier.success('Added');
                this.removeFile(file);
            },
            acceptedFiles: '.csv'
        };

        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Placement file</div>
                </div>
                <div className="main__block">
                    <div className="add-content">
                        <i className="icon-upload"/>
                        <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
                    </div>
                </div>
                <div className="upload-section">
                    <ImportingRules rules={"placementRules"} model={facility}/>
                </div>
            </div>
        )
    }
}