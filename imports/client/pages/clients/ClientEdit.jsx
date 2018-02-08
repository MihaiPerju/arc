import React from 'react';
import ClientSchema from '/imports/api/clients/schemas/schema';
import {AutoForm, AutoField, ErrorField, ListField, ListItemField, NestField, TextField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import DropzoneComponent from 'react-dropzone-component';
import {path, getToken} from '/imports/api/s3-uploads/utils';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class EditClient extends React.Component {
    constructor() {
        super();

        this.state = {
            model: {},
            error: null,
        };
    }

    getClient() {
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
                    })
                }
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    componentWillMount() {
        this.getClient();
    }

    onRemoveLogo() {
        const clientId = this.props.userId;

        Meteor.call('client.removeLogo', clientId, (err) => {
            if (!err) {
                Notifier.success("Logo removed!");
                this.getClient();
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    onSubmit(data) {
        const clientId = this.props.userId;

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
        const {model} = this.state;
        const clientId = this.props.userId;

        const componentConfig = {
            postUrl: '/uploads/logo/' + clientId + '/' + getToken()
        };

        const djsConfig = {
            complete(file) {
                Notifier.success('Logo added');
                this.removeFile(file);
                that.getClient();
            },
            acceptedFiles: 'image/*'
        };

        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Edit Client</Header>
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
                                model.logoId
                                    ?
                                    <div>
                                        <img src={'/image/' + model.logoId}/>
                                        <a href="" onClick={this.onRemoveLogo.bind(this)}>Remove Logo</a>
                                    </div>
                                    : <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
                            }

                            <ListField name="contacts">
                                <ListItemField name="$">
                                    <NestField name="">
                                        <TextField name="firstName"/>
                                        <TextField name="lastName"/>
                                        <TextField name="contactDescription"/>
                                        <TextField name="phone"/>
                                        <TextField name="email"/>
                                        <TextField name="notes"/>
                                    </NestField>
                                </ListItemField>
                            </ListField>

                            <Divider/>

                            <Button primary fluid type="submit">
                                Save
                            </Button>
                        </AutoForm>
                    )
                }
            </Container>
        )
    }
}