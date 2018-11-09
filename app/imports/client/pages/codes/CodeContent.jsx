import React, {Component} from 'react';
import CodeHeader from './components/CodeContent/CodeHeader';
import DescriptionBlock from './components/CodeContent/DescriptionBlock';
import ActionBlock from './components/CodeContent/ActionBlock';
import CodeEdit from './CodeEdit';

export default class CodeContent extends Component {
    constructor() {
        super();
        this.state = {
            edit: false
        }
    }

    componentWillReceiveProps(){
        this.setState({edit:false});
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
                        </div>
                }
            </div>
        )
    }
}