import React, {Component} from 'react';
import _ from 'underscore';
import LetterTemplateSingle from './LetterTemplateSingle.jsx';

export default class LetterTemplateList extends Component {
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
                    {
                        data.length
                            ?
                            <div>
                                <tr>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                                {_.map(data, (letterTemplate, idx) => {
                                    return <LetterTemplateSingle letterTemplate={letterTemplate} key={idx}/>;
                                })}
                            </div>
                            :
                            <div>
                                There are no letter templates
                            </div>
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}