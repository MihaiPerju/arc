import React, {Component} from 'react';
import ReportEdit from './ReportEdit';
import ReportHeader from './components/ReportContent/ReportHeader';

export default class ReportContent extends Component {
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
        const {report} = this.props;
        return (
            <div>
                {
                    edit ? <ReportEdit setEdit={this.setEdit} code={code}/> :
                        <ReportHeader report={report}/>
                }
            </div>
        )
    }
}