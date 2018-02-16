import React, {Component} from 'react';
import CodeHeader from './components/CodeContent/CodeHeader';
import DescriptionBlock from './components/CodeContent/DescriptionBlock';
import Note from './components/CodeContent/Note';
import ActionBlock from './components/CodeContent/ActionBlock';
import NewAction from '/imports/client/pages/tasks/components/TaskContent/NewAction';

export default class CodeContent extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="main-content code-content">
                <CodeHeader/>
                <DescriptionBlock/>
                <ActionBlock/>
            </div>
        )
    }
}