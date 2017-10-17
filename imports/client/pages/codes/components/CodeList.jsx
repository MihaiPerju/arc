import React, {Component} from 'react';
import _ from 'underscore';
import CodeSingle from './CodeSingle.jsx';
import CodeHeadList from './CodeHeadList';

export default class CodeList extends Component {
    render() {
        const {data, loading, error, handleHeaderClick, sortBy, isSortAscend} = this.props;

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
                                <CodeHeadList sortBy={sortBy}
                                              isSortAscend={isSortAscend}
                                              handleHeaderClick={handleHeaderClick}/>
                                {_.map(data, (code, idx) => {
                                    return <CodeSingle code={code} key={idx}/>;
                                })}
                            </div>
                            :
                            <div>
                                There are no CARC/RARC codes.
                            </div>
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}