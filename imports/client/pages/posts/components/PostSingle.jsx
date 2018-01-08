import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import {Icon, Label, Menu, Table} from 'semantic-ui-react'
import {Button, Dropdown} from 'semantic-ui-react'

export default class PostSingle extends Component {
    deletePost() {
        const {post} = this.props;

        Meteor.call('post.delete', post._id, (err) => {
            if (!err) {
                Notifier.success('Post deleted !');
                FlowRouter.reload();
            }
        });
    }

    isMyPost() {
        const {post} = this.props;

        return post.user._id === Meteor.userId();
    }

    render() {
        const {post} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{post.title}</Table.Cell>
                <Table.Cell>{post.content}</Table.Cell>
                <Table.Cell>{post.user.emails[0].address}</Table.Cell>
                <Table.Cell>
                    {this.isMyPost() ?
                        <Dropdown button text='Action' icon={null}>
                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    <Button primary href={"/post/" + post._id + "/edit"}>Edit</Button>
                                    <Button color="red" onClick={this.deletePost.bind(this)}>Delete</Button>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        :
                        null
                    }
                </Table.Cell>
            </Table.Row>
        );
    }
}