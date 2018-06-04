import React, {Component} from 'react';
import {AutoForm, SelectField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import TagContentSingle from './TagContentSingle';
import Notifier from "/imports/client/lib/Notifier";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import ReportsEnum from "../../../../../api/schedules/enums/reports";

export default class TagContentDescription extends Component {

    getOptions = (users) => {
        return _.map(users, (user) => ({
            value: user._id,
            label: `${user.profile.firstName} ${user.profile.lastName}`
        }));
    };

    onSubmit = (data) => {
        const {userId} = data;
        const {currentTag} = this.props;
        Meteor.call('user.addTag', {_id: userId, tagId: currentTag._id}, (err, res) => {
            if (!err) {
                Notifier.success('Successfully added !')
            }
        })
    }

    render() {
        const {users, currentTag, untaggedUsers, taggedUsers} = this.props;
        const options = this.getOptions(untaggedUsers);

        return (
            <div className="create-form">
                <div className="action-block i--block">
                    <div className="header__block">
                        <div className="title-block text-uppercase">Users</div>
                    </div>
                    <AutoForm schema={schema} onSubmit={this.onSubmit.bind(this)} ref="form">
                        <div className="select-group">
                            <div className="form-wrapper">
                                <SelectMulti className="form-select__multi"
                                             placeholder="Select User"
                                             labelHidden={true}
                                             name="userId"
                                             options={options}/>
                                <ErrorField name="userId"/>
                            </div>
                        </div>
                        <div className="btn-group-1 flex--helper">
                            <button className="btn--red">Remove all</button>
                            <button className="btn--green">Submit</button>
                        </div>
                    </AutoForm>
                </div>

                <div className="action-table">
                    <div className="action-table__wrapper">
                        <div className="action-table__row flex--helper">
                            <div className="action-table__header action-table__field text-light-grey">
                                Name
                            </div>
                            <div className="action-table__header action-table__field text-center text-light-grey">
                                Actions
                            </div>
                        </div>
                        {
                            taggedUsers.map((user, index) => (
                                <TagContentSingle
                                    key={index}
                                    userName={`${user.profile.firstName} ${user.profile.lastName}`}
                                    userId={user._id}
                                    currentTag={currentTag}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>

        )
    }
}

const schema = new SimpleSchema({
    userId: {
        type: String
    }
});