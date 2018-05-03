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

    componentWillReceiveProps(){
        this.setState({edit:false});
    }

    setEdit = () => {
        const {edit} = this.state;
        this.setState({edit: !edit})
    };

    render() {
        const {edit} = this.state;
        const {report} = this.props;

        return (
            <div className="report-section">
                {
                    edit ? <ReportEdit setEdit={this.setEdit} report={report}/> :
                        <ReportHeader setEdit={this.setEdit} report={report}/>
                }
            </div>
        )
    }
}