import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';
import Dialog from '/imports/client/lib/ui/Dialog';
import {AutoForm, AutoField, ErrorField, SelectField} from '/imports/ui/forms';
import TagsSchema from '/imports/api/tags/schemas/schema';
import Notifier from '/imports/client/lib/Notifier';
import TagsList from './TagsList.jsx';

export default class CreateEditTags extends Component {
    constructor() {
        super();

        this.state = {
            cancelDialogActive: false,
            showSpecificRoles: false,
        };
    }

    componentDidMount() {
        this.setState({
            tags: this.props.tags
        });
    }

    dialogToggle = () => {
        const {cancelDialogActive} = this.state;
        this.setState({
            cancelDialogActive: !cancelDialogActive
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
        const {tags} = this.state;
        const {onTagsChange} = this.props;

        Meteor.call('tag.create', model, (err, data) => {
            if (!err) {
                model._id = data;
                tags.push(model);
                this.setState({
                    tags
                });
                onTagsChange(tags);

                Notifier.success('Tag successfully created!');
                this.refs.tagForm.reset();
            } else {
                Notifier.error(err.reason);
            }
        });
    };

    onTagsChange = (tags) => {
        const {onTagsChange} = this.props;

        this.setState({
            tags
        });
        onTagsChange(tags);
    };

    render () {
        const {cancelDialogActive, showSpecificRoles, tags} = this.state;
        const actions = [
            <Button onClick={this.dialogToggle}>Cancel</Button>,
            <Button onClick={this.saveTags}>Save</Button>,
        ];
        const visibilitySelect = [{value: 0, label: 'Select visibility'}, {value: 1, label: 'Public'}];

        return (
            <div>
                <div className="add-filter text-center" onClick={this.dialogToggle}>Manage Tags</div>
                {
                    cancelDialogActive && (
                        <Dialog closePortal={this.dialogToggle}
                                title="Manage Tags"
                                actions={actions}>
                            <div className="create-form">
                                <div className="create-form__wrapper">
                                    <div className="action-block">

                                        <AutoForm schema={TagsSchema} onChangeModel={this.onFormChange}
                                                  onSubmit={this.onSubmitForm}
                                                  ref="tagForm">

                                            <div className="form-wrapper">
                                                <AutoField labelHidden={true} placeholder="Name" name="name"/>
                                                <ErrorField name="name"/>
                                            </div>

                                            <div className="form-wrapper">
                                                <SelectField labelHidden={true} placeholder="Privacy" name="privacy"/>
                                            </div>
                                            {
                                                showSpecificRoles &&
                                                <div className="form-wrapper">
                                                    <AutoField labelHidden={true} placeholder="Visibility"
                                                               name="visibility"/>
                                                </div>
                                            }
                                            <div className="form-wrapper">
                                                <button className="btn--green">Create new tag</button>
                                            </div>
                                        </AutoForm>
                                    </div>
                                </div>
                            </div>
                            <h2>List of available tags</h2>

                            <TagsList tags={tags} onTagsChange={this.onTagsChange}/>

                        </Dialog>
                    )
                }
            </div>

        );
    }
}