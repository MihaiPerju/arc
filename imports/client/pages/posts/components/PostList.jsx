import React, {Component} from 'react';
import _ from 'underscore';
import PostSingle from './PostSingle.jsx';

export default class PostList extends Component {
    render() {
        const {data, loading, error} = this.props;

        if (loading) {
            return <div>Loading</div>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <th>Title</th>
                        <th>Content</th>
                        <th>User</th>
                        <th>Actions</th>
                    </tr>
                    {_.map(data, (post) => {
                        return <PostSingle post={post} key={post._id}/>;
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}