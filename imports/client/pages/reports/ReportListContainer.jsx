import React, {Component} from 'react'
import ReportList from './components/ReportList.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import ReportContent from './ReportContent.jsx';
import ScheduleBlock from './ScheduleBlock.jsx';
import FilterBar from '/imports/client/lib/FilterBar.jsx';
import ReportCreate from './ReportCreate.jsx';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/reports/queries/reportsList";
import Loading from '/imports/client/lib/ui/Loading';
import {objectFromArray} from "/imports/api/utils";

class ReportListContainer extends Component {
    constructor() {
        super();
        this.state = {
            reportsSelected: [],
            currentReport: null,
            filter: false,
            create: false
        };
        this.showFilterBar = this.showFilterBar.bind(this);
        this.createForm = this.createForm.bind(this);
    }

    setReport = (_id) => {
        const {currentReport} = this.state;

        if (currentReport === _id) {
            this.setState({currentReport: null});
        } else {
            this.setState({currentReport: _id});
        }
    };

    selectReport = (_id) => {
        const {reportsSelected} = this.state;
        if (reportsSelected.includes(_id)) {
            reportsSelected.splice(reportsSelected.indexOf(_id), 1);
        } else {
            reportsSelected.push(_id);
        }
        this.setState({reportsSelected});
    };

    showFilterBar() {
        this.setState({
            filter: !this.state.filter
        })
    }

    createForm() {
        this.setState({
            create: true
        })
    }

    createSchedule = () => {
        this.setState({
            schedule: true
        })
    }

    render() {
        const {data, loading, error} = this.props;
        const {reportsSelected, currentReport, create, schedule} = this.state;
        this.setState({create: true})
    }

    closeForm = () => {
        this.setState({create: false});
    };

    render() {
        const {data, loading, error} = this.props;
        const {reportsSelected, currentReport, create} = this.state;
        const report = objectFromArray(data, currentReport);

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <div className="cc-container">
                <div className={
                    currentReport || create ? "left__side" : "left__side full__width"
                }>
                    <SearchBar btnGroup={reportsSelected.length} filter={this.showFilterBar}/>
                    <ReportList
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        reportsSelected={reportsSelected}
                        selectReport={this.selectReport}
                        currentReport={currentReport}
                        setReport={this.setReport}
                        reports={data}
                    />
                    <PaginationBar close={this.closeForm} create={this.createForm}/>
                </div>
                {
                    currentReport ? (
                        <RightSide report={report}/>
                    ) : create ? (
                        <RightSide close={this.closeForm} create/>
                    ) : null
                }
            </div>
        );
    }
}

class RightSide extends Component {
    constructor() {
        super();
        this.state = {
            fade: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({fade: true});
        }, 300);
    }

    render() {
        const {report, create, close} = this.props;
        return (
            <div className={this.state.fade ? "right__side in" : "right__side"}>
                {
                    create ? (
                        <ReportCreate close={close}/>
                    ) : (
                        <ReportContent report={report}/>
                    )
                }
            </div>
        )
    }
}

export default withQuery((props) => {
    return query.clone();
})(ReportListContainer)