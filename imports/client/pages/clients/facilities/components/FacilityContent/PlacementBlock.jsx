import React, {Component} from 'react';
import UploadItem from './UploadItem';
import Notifier from "../../../../../lib/Notifier";
import DropzoneComponent from 'react-dropzone-component';

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
                <UploadForm/>
            </div>
        )
    }
}

class UploadForm extends Component {
    render() {
        return (
            <div className="upload-section">
                {/*<form action="">*/}
                    {/*<div className="form-wrapper">*/}
                        {/*<div className="radio-group">*/}
                            {/*<h6>File with header</h6>*/}
                            {/*<div className="radio-item">*/}
                                {/*<input type="radio" id="r1" name="header"/>*/}
                                {/*<label htmlFor="r1">True</label>*/}
                            {/*</div>*/}
                            {/*<div className="radio-item">*/}
                                {/*<input type="radio" id="r2" name="header"/>*/}
                                {/*<label htmlFor="r2">False</label>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="btn-group">*/}
                            {/*<button className="btn--red">Cancel</button>*/}
                            {/*<button className="btn--green">Submit</button>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</form>*/}
            </div>
        )
    }
}