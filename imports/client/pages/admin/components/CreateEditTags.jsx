import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Dialog from '/imports/client/lib/ui/Dialog';
import { AutoForm, AutoField, ErrorField, SelectField } from 'uniforms-semantic';
import TagsSchema from '/imports/api/tags/schemas/schema';
import Notifier from '/imports/client/lib/Notifier';

export default class CreateEditTags extends Component {
    constructor () {
        super();

        this.state = {
            cancelDialogActive: false,
            showSpecificRoles: false
        };
    }

    dialogOpen = () => {
        this.setState({
            cancelDialogActive: true
        });
    };

    dialogClose = () => {
        this.setState({
            cancelDialogActive: false
        });
    };

    onFormChange = (model) => {
        let showSpecificRoles = false;
        if (model.privacy == 'Specific roles') {
            showSpecificRoles = true;
        }
        this.setState({
            showSpecificRoles
        });
    };

    onSubmitForm = (model) => {
        Meteor.call('tag.create', model, (err) => {
            if (!err) {
                Notifier.success('Tag created!');
                this.refs.tagForm.reset();
            } else {
                Notifier.error(err.reason);
            }
        });
    };

    render () {
        const {cancelDialogActive, showSpecificRoles} = this.state;
        const actions = [
            <Button onClick={this.dialogClose}>Cancel</Button>,
            <Button onClick={this.saveTags}>Save</Button>,
        ];
        const visibilitySelect = [{value: 0, label: 'Select visibility'}, {value: 1, label: 'Public'}];

        return (
            <div>
                <Button type="button" onClick={this.dialogOpen}>Manage Tags</Button>
                {
                    cancelDialogActive && (
                        <Dialog closePortal={this.dialogClose}
                                title="Manage Tags"
                                actions={actions}>

                            <AutoForm schema={TagsSchema} onChangeModel={this.onFormChange} onSubmit={this.onSubmitForm}
                                      ref="tagForm">

                                {this.state.error && <div className="error">{this.state.error}</div>}

                                <AutoField name="name"/>
                                <ErrorField name="name"/>

                                <SelectField name="privacy"/>

                                {
                                    showSpecificRoles &&
                                    <AutoField name="visibility"/>
                                }
                                <Button color="green">Create new tag</Button>
                            </AutoForm>

                            <h2>List of current tags</h2>
                        </Dialog>
                    )
                }
            </div>

        );
    }
}