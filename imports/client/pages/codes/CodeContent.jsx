import React, {Component} from 'react';
import CodeHeader from './components/CodeContent/CodeHeader';
import DescriptionBlock from './components/CodeContent/DescriptionBlock';
import Note from './components/CodeContent/Note';
import ActionBlock from './components/CodeContent/ActionBlock';
import NewAction from '/imports/client/pages/tasks/components/TaskContent/NewAction';
import CodeEdit from './CodeEdit';

export default class CodeContent extends Component {
    constructor() {
        super();
        this.state = {
            edit: false
        }
    }

    setEdit = () => {
        const {edit} = this.state;
        this.setState({edit: !edit})
    };

    render() {
        const {edit} = this.state;
        const {code} = this.props;
        return (
            <div className="main-content code-content">
                {
                    edit ? <CodeEdit setEdit={this.setEdit} code={code}/> :
                        <div>
                            <CodeHeader setEdit={this.setEdit} code={code}/>
                            <DescriptionBlock code={code}/>
                            <ActionBlock code={code}/>
                            <Note code={code}/>
                        </div>
                }
            </div>
        )
    }
}