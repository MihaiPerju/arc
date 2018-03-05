import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import TagsService from '../services/TagsService';
import { Button } from 'semantic-ui-react';
import Notifier from '/imports/client/lib/Notifier';

export default class TagsList extends Component {
    constructor () {
        super();

    }

    componentDidMount () {
    }

    removeTag (index) {
        const {tags} = this.props;

        Meteor.call('tag.delete', tags[index]._id, (err) => {
            if (!err) {
                Notifier.success('Tag has been deleted !');
            } else {
                Notifier.error('An error has occured: ' + err.reason);
            }
        });
    }

    render () {
        const {tags} = this.props;

        return (
            <div className="action-block schedule-block">
                <div className="main__block">
                    <div className="schedule-list">
                        {tags.map((tag, index) => (
                            <div key={index} className="schedule-item">
                                <div className="left__side">
                                    <div className="info">
                                        <div className="text-light-grey">
                                            {tag.name}
                                        </div>
                                        <div className="info-label">
                                            {TagsService.getTagPrivacy(tag)}
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-group">
                                    <button onClick={this.removeTag.bind(this, index)} className="btn--red"><i
                                        className="icon-trash-o"/> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}