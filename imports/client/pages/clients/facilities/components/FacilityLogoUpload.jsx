import React from 'react';
import {Container, Header} from 'semantic-ui-react'
import DropzoneComponent from 'react-dropzone-component';
import Notifier from '/imports/client/lib/Notifier';
import {getToken} from '/imports/api/s3-uploads/utils';

export default class FacilityLogoUpload extends React.Component {
    constructor() {
        super()
    }

    render() {
        const {facilityId} = this.props;

        const componentConfig = {
            postUrl: `/uploads/facility-logo/${facilityId}/${getToken()}`
        };

        const djsConfig = {
            complete(file) {
                Notifier.success('Added');
                this.removeFile(file);
            }
        };

        return <Container>
            <Header textAlign='center' as='h2'>Logo</Header>
            <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
        </Container>
    }
}