import React, {Component} from 'react';
import UploadItem from './UploadItem';

export default class PaymentBlock extends Component {
    render() {
    	const uploads = [
    	    { status: 'Pending', city: 'Amsterdam', region: 'None', state: 'None', zip: 'None' }
    	];

        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Payment</div>
                </div>
                <div className="main__block">
                    <div className="add-content">
                        <i className="icon-upload"/>
                        <div className="text-center">+ Upload payment file</div>
                    </div>
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
            </div>
        )
    }
}