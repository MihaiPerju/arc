import React, {Component} from 'react';
import ReportHeader from './components/ReportContent/ReportHeader';

export default class ReportContent extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="main-content report-content">
                <ReportHeader/>
                <h1>Report Content</h1>
            </div>
        )
    }
}