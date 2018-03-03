import React, {Component} from 'react';
import {Table} from 'semantic-ui-react';
import TagsService from '../services/TagsService';
import {Button} from 'semantic-ui-react';
import Notifier from '/imports/client/lib/Notifier';

export default class TagsList extends Component {
    constructor() {
        super();

        this.state = {
            tags: []
        };
    }

    componentDidMount() {
        this.setState({
            tags: this.props.tags
        });
    }

    removeTag(index) {
        const {tags} = this.state;
        const {onTagsChange} = this.props;

        Meteor.call('tag.delete', tags[index]._id, (err) => {
            if (!err) {
                Notifier.success('Tag has been deleted !');
            } else {
                Notifier.error('An error has occured: ' + err.reason);
            }
        });

        tags.splice(index, 1);
        this.setState({
            tags
        });
        onTagsChange(tags);
    }

    render() {
        const {tags} = this.state;

        return (
            <Table padded>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Visibility</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tags.map((tag, index) => (
                        <Table.Row>
                            <Table.Cell>{tag.name}</Table.Cell>
                            <Table.Cell>{TagsService.getTagPrivacy(tag)}</Table.Cell>
                            <Table.Cell><Button onClick={this.removeTag.bind(this, index)}
                                                color="red">Remove</Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    }
}