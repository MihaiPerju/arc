import React from 'react';
import ClientSchema from '/imports/api/clients/schemas/schema';
import {AutoForm, AutoField, ErrorField, ListField, ListItemField, NestField, TextField} from 'uniforms-unstyled';
import Notifier from '/imports/client/lib/Notifier';
import DropzoneComponent from 'react-dropzone-component';
import {path, getToken} from '/imports/api/s3-uploads/utils';

export default class EditClient extends React.Component {
    constructor() {
        super();

        this.state = {
            model: {},
            error: null,
            uploadId: null,
            uploadPath: null
        };
    }

    componentWillMount() {
        const clientId = this.props.userId;

        Meteor.call('client.get', clientId, (err, res) => {
            if (!err) {
                if (!res) {
                    //case if url is invalid
                    Notifier.error("Invalid request!");
                    this.setState({
                        error: "Cannot process. Invalid request"
                    });
                } else {
                    this.setState({
                        model: res,
                        uploadPath: res.logoPath
                    })
                }
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    getPath(uploadId) {
        Meteor.call('client.getLogoPath', uploadId, (err, uploadPath) => {
            if (!err) {
                this.setState({
                    uploadPath
                });
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    onRemoveLogo() {
        const clientId = this.props.userId;
        const {uploadId} = this.state;

        Meteor.call('client.removeLogo', clientId, uploadId, (err) => {
            if (!err) {
                Notifier.success("Logo removed!");
                this.setState({
                    uploadPath: null
                });
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    onSubmit(data) {
        const clientId = this.props.userId;
        data.logoPath = this.state.uploadPath;

        Meteor.call('client.update', clientId, data, (err) => {
            if (!err) {
                Notifier.success("Data saved");
                FlowRouter.go('/client/list');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        const that = this;
        const {uploadPath} = this.state;
        const {model} = this.state;

        const componentConfig = {
            postUrl: '/uploads/logo/' + getToken()
        };

        const djsConfig = {
            complete(file) {
                const uploadId = JSON.parse(file.xhr.response).uploadId;
                that.setState({
                    uploadId
                });
                that.getPath(uploadId);

                Notifier.success('Logo added');
                this.removeFile(file);
            }
        };

        return (
            <div>
                <h2>Edit Client</h2>
                {this.state.error
                    ? <div className="error">{this.state.error}</div>
                    : (
                        <AutoForm model={model} schema={ClientSchema} onSubmit={this.onSubmit.bind(this)} ref="form">

                            <AutoField name="clientName"/>
                            <ErrorField name="clientName"/>

                            <AutoField name="firstName"/>
                            <ErrorField name="firstName"/>

                            <AutoField name="lastName"/>
                            <ErrorField name="lastName"/>

                            <AutoField name="email"/>
                            <ErrorField name="email"/>

                            <h3>Client Logo</h3>
                            {
                                uploadPath
                                    ?
                                    <div>
                                        <img src={path(uploadPath)}/>
                                        <a href="" onClick={this.onRemoveLogo.bind(this)}>Remove Logo</a>
                                    </div>
                                    : <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
                            }

                            <ListField name="contacts">
                                <ListItemField name="$">
                                    <NestField>
                                        <TextField name="firstName"/>
                                        <TextField name="lastName"/>
                                        <TextField name="contactDescription"/>
                                        <TextField name="phone"/>
                                        <TextField name="email"/>
                                        <TextField name="notes"/>
                                    </NestField>
                                </ListItemField>
                            </ListField>

                            <button type="submit">
                                Save
                            </button>
                        </AutoForm>
                    )
                }
            </div>
        )
    }
}