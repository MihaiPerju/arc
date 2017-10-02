import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';

export default class PostSingle extends Component {
    deletePost() {
        const {post} = this.props;

        Meteor.call('post.delete', post._id, (err)=> {
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
            <tr>
                <td>{post.title}</td>
                <td>{post.content}</td>
                <td>{post.user.emails[0].address}</td>
                <td>
                    {this.isMyPost() ?
                        <div>
                            <a href={"/post/" + post._id + "/edit"}>Edit</a>
                            <button onClick={this.deletePost.bind(this)}>Delete</button>
                        </div>
                        :
                        null
                    }
                </td>
            </tr>
        );
    }
}