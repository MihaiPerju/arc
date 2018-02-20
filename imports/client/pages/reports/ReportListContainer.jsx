import React, {Component} from 'react'
import ReportList from './components/ReportList.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import ReportContent from './ReportContent.jsx';
import FilterBar from '/imports/client/lib/FilterBar.jsx';
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
            filter: false
        };
        this.showFilterBar = this.showFilterBar.bind(this);
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

    render() {
        const {data, loading, error} = this.props;
        const {reportsSelected, currentReport} = this.state;
        const report = objectFromArray(data, currentReport);

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <div className="cc-container">
                <div className={currentReport ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={reportsSelected.length} filter={this.showFilterBar}/>
                    {this.state.filter ? <FilterBar/> : null}
                    <ReportList
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        reportsSelected={reportsSelected}
                        selectReport={this.selectReport}
                        currentReport={currentReport}
                        setReport={this.setReport}
                        reports={data}
                    />
                    <PaginationBar/>
                </div>
                {
                    currentReport ? (
                        <RightSide report={report}/>
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
        const {report} = this.props;
        return (
            <div className={this.state.fade ? "right__side in" : "right__side"}>
                <ReportContent report={report}/>
            </div>
        )
    }
}

export default withQuery((props) => {
    return query.clone();
})(ReportListContainer)