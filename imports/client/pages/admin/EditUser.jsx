import React, {Component} from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import query from '/imports/api/users/queries/singleUser.js';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import {Button} from 'semantic-ui-react';
import {Container} from 'semantic-ui-react';
import {Divider} from 'semantic-ui-react';
import CreateEditTags from './components/CreateEditTags';
import SelectMulti from '/imports/client/lib/uniforms/SelectMulti.jsx';
import TagsService from './services/TagsService';

export default class EditUser extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            allTags: [],
            tags: []
        };
    }

    componentWillReceiveProps(newProps) {
        // if (!this.props.data && newProps.data) {
        //     this.setState({
        //         email: newProps.data.emails[0].address,
        //         firstName: newProps.data.profile.firstName,
        //         lastName: newProps.data.profile.lastName,
        //         phoneNumber: newProps.data.profile.phoneNumber
        //     });
        // }
    }

    componentWillMount() {
        // Meteor.call('tag.getAll', (err, allTags) => {
        //
        //     this.setState({
        //         allTags
        //     });
        // });
    }

    onSubmit(formData) {
        // Meteor.call('admin.editUser', this.props.data._id, formData, (err) => {
        //     if (!err) {
        //         Notifier.success('Data saved !');
        //         FlowRouter.go('/admin/user/list');
        //     } else {
        //         Notifier.error(err.reason);
        //     }
        // });
    }

    onChangeField(fieldName, value) {
        // const stateObj = {};
        // stateObj[fieldName] = value;
        //
        // this.setState(stateObj);
    }

    getTagList = () => {
        // const {allTags} = this.state;
        //
        // return allTags.map((tag, key) => ({value: tag._id, label: TagsService.getTagName(tag)}));
    };

    onTagsChange = (tags) => {
        // this.setState({
        //    tags
        // });
    }

    render() {
        const {data, loading, error} = this.props;
        const {allTags} = this.state;
        const model = data;
        const tags = this.getTagList();
        if (model) {
            model.email = data && data.emails[0].address;
        }

        if (loading) {
            return <div>
                <span>Loading</span>
            </div>;
        }

        if (error) {
            return <div>
                <span>Error: {error.reason}</span>
            </div>;
        }

        return (
            <Container className="page-container">
                {/*<AutoForm model={model} schema={EditSchema} onSubmit={this.onSubmit.bind(this)} ref="form">*/}
                {/*{this.state.error*/}
                {/*? <div className="error">{this.state.error}</div>*/}
                {/*: ''*/}
                {/*}*/}

                {/*<AutoField name="profile.firstName"/>*/}
                {/*<ErrorField name="profile.firstName"/>*/}

                {/*<AutoField name="profile.lastName"/>*/}
                {/*<ErrorField name="profile.lastName"/>*/}

                {/*<AutoField name="email"/>*/}
                {/*<ErrorField name="email"/>*/}

                {/*<AutoField name="profile.phoneNumber"/>*/}
                {/*<ErrorField name="profile.phoneNumber"/>*/}

                {/*<SelectMulti name="tagIds" options={tags}/>*/}
                {/*<ErrorField name="tagIds"/>*/}

                {/*{*/}
                {/*allTags &&*/}
                {/*<CreateEditTags tags={allTags} onTagsChange={this.onTagsChange}/>*/}
                {/*}*/}

                {/*<Divider/>*/}

                {/*<Button primary fluid type="submit">*/}
                {/*Save*/}
                {/*</Button>*/}
                {/*</AutoForm>*/}
            </Container>
        );
    }
}

const EditSchema = new SimpleSchema({
    'profile': {type: Object},
    'profile.firstName': {type: String},
    'profile.lastName': {type: String},
    'profile.phoneNumber': {type: String, optional: true},
    'email': {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    tagIds: {
        label: 'Tags',
        type: Array,
        optional: true
    },
    'tagIds.$': {
        type: String
    }
});