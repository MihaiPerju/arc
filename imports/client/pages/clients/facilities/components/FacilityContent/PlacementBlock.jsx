import React, {Component} from 'react';
import UploadItem from './UploadItem';
<<<<<<< HEAD
=======
import Notifier from "../../../../../lib/Notifier";
import DropzoneComponent from 'react-dropzone-component';
import ImportingRules from '../ImportingRules';
>>>>>>> included importing rules

export default class PlacementBlock extends Component {
    render() {
        const uploads = [
            { status: 'Hold', city: 'Madrid', region: 'None', state: 'None', zip: 'None' },
            { status: 'None', city: 'None', region: 'None', state: 'None', zip: 'None' }
        ];

        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Placement</div>
                </div>
                <div className="main__block">
                    <div className="add-content">
                        <i className="icon-upload"/>
                        <div className="text-center">+ Upload placement file</div>
                    </div>
                </div>
<<<<<<< HEAD
                <UploadForm/>
                <div className="upload-list">
                    {
                        uploads.map(function(upload, index){
                            return (
                                <UploadItem
                                    key={index}
                                    status={upload.status}
                                    city={upload.city}
                                    region={upload.region}
                                    state={upload.state}
                                    zip={upload.zip}
                                />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

class UploadForm extends Component {
    render() {
        return (
            <div className="upload-section">
                <form action="">
                    <div className="form-wrapper">
                        <div className="radio-group">
                            <h6>File with header</h6>
                            <div className="radio-item">
                                <input type="radio" id="r1" name="header"/>
                                <label htmlFor="r1">True</label>
                            </div>
                            <div className="radio-item">
                                <input type="radio" id="r2" name="header"/>
                                <label htmlFor="r2">False</label>
                            </div>
                        </div>
                        <div className="btn-group">
                            <button className="btn--red">Cancel</button>
                            <button className="btn--green">Submit</button>
                        </div>
                    </div>
                </form>
=======
                <div className="upload-section">
                    <ImportingRules rules={"placementRules"} model={facility}/>
                </div>
                <div className="upload-section">
                    <UploadItem/>
                </div>
>>>>>>> included importing rules
            </div>
        )
    }
}