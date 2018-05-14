import React, { Component } from 'react';
import { AutoForm, SelectField, ErrorField } from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import TagContentSingle from './TagContentSingle';
import Notifier from "/imports/client/lib/Notifier";

export default class TagContentDescription extends Component {

	getOptions = (users) => {
		return _.map(users, (user) => ({
			value: user._id,
			label: `${user.profile.firstName} ${user.profile.lastName}`
		}));
	};

	onSubmit = (data) => {
		const { userId } = data;
		const { currentTag } = this.props;
		Meteor.call('user.addTag', { _id: userId, tagId: currentTag._id }, (err, res) => {
			if (!err) {
				Notifier.success('Successfully added !')
			}
		})
	}

	render() {
		const { users, currentTag, untaggedUsers, taggedUsers } = this.props;
		const options = this.getOptions(untaggedUsers);

		return (
			<div className="action-block">
				<div className="header__block">
					<div className="title-block text-uppercase">Users</div>
				</div>

				<div className="create-form">
					<div className="create-form__wrapper">
						<div className="action-block">
							<AutoForm schema={schema} onSubmit={this.onSubmit.bind(this)} ref="form">
								<div className="select-group">
									<div className="form-wrapper">
										<SelectField placeholder="Select User"
											labelHidden={true}
											options={options}
											name="userId" />
										<ErrorField name="userId" />
									</div>
								</div>
								<button style={{ float: 'right' }} className="btn--green">submit</button>
							</AutoForm>
						</div>
					</div>
				</div>
				<div className="table-list">
					<div className="table-list__wrapper">
						<div className="table-container">
							<div className="table-row">
								<div className="table-header text-center table-field text-light-grey">
									Name
                                </div>
								<div className="table-header text-center table-field text-light-grey">
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

			</div>
		)
	}
}

const schema = new SimpleSchema({
	userId: {
		type: String
	}
});