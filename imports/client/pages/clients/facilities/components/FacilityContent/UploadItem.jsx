import React, {Component} from 'react';
import {AutoField, ErrorField} from '/imports/ui/forms';

export default class UploadItem extends Component {
    render() {
        const {fields} = this.props;
        return <div className="upload-item">
            {
                fields && fields.map((field, index) => {
                    if (field !== 'newInsBal')
                        return (
                            <div className="text-center" key={index}>
                                <AutoField backgroundStyle={{"background": "#FFFFFF", "text-align": "center"}}
                                           className="text-light-grey"
                                           placeholder={"Not configured"}
                                           name={field.value}/>
                                <ErrorField name={field.value}/>
                            </div>
                        )
                })
            }
        </div>
    }
}