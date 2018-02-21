import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import Notifier from '/imports/client/lib/Notifier';
import {Container, Divider} from 'semantic-ui-react'
import ImportingRules from '/imports/client/pages/clients/facilities/components/ImportingRules';

export default class UploadPlacementFile extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {model, updateFacility} = this.props;

        const componentConfig = {
            postUrl: `/uploads/csv/${model && model._id}`
        };

        const djsConfig = {
            complete(file) {
                Notifier.success('Added');
                this.removeFile(file);
            },
            acceptedFiles: '.csv'
        };
        return (
            <Container>
                <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
                <Divider/>
                <ImportingRules rules={"placementRules"} updateFacility={updateFacility} model={model}/>
            </Container>
        )
    }
}
