import React, {Component} from 'react';
import _ from 'underscore';
import ActionSingle from './ActionSingle.jsx';

export default class ActionList extends Component {
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
                        <th>Description</th>
                    </tr>
                    {_.map(data, (action) => {
                        return <ActionSingle action={action} key={action._id}/>;
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}