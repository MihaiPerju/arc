import React from 'react';
import {Container, Header} from 'semantic-ui-react'
import DropzoneComponent from 'react-dropzone-component';
import Notifier from '/imports/client/lib/Notifier';
import {getToken} from '/imports/api/s3-uploads/utils';
import {getImagePath} from '/imports/api/utils';

export default class FacilityLogoUpload extends React.Component {
    constructor() {
        super();
        this.state = {
            logoPath: null
        }
    }

    getLogo() {
        const {facilityId} = this.props;
        Meteor.call('facility.getLogo', facilityId, (err, logoPath) => {
            if (!err) {
                this.setState({
                    logoPath
                })
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    componentWillMount() {
        this.getLogo();
    }

    onRemoveLogo() {
        const {facilityId} = this.props;
        const {logoPath} = this.state;
        Meteor.call('facility.removeLogo', facilityId, logoPath, (err) => {
            if (!err) {
                Notifier.success("Logo removed!");
                this.getLogo();
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        const {facilityId} = this.props;
        const {logoPath} = this.state;
        const that = this;

        const componentConfig = {
            postUrl: `/uploads/facility-logo/${facilityId}/${getToken()}`
        };

        const djsConfig = {
            complete(file) {
                Notifier.success('Added');
                this.removeFile(file);
                that.getLogo();
            },
            acceptedFiles: "image/*"
        };

        return <Container>
            <Header textAlign='center' as='h2'>Logo</Header>
            {logoPath
                ?
                <div>
                    <img src={getImagePath(logoPath)}/>
                    <a href="" onClick={this.onRemoveLogo.bind(this)}>Delete Logo</a>
                </div>
                : <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
            }
        </Container>
    }
}