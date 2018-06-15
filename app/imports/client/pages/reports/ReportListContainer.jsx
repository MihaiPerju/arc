import React, { Component } from "react";
import ReportList from "./components/ReportList.jsx";
import ReportSearchBar from "./components/ReportSearchBar.jsx";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import ReportContent from "./ReportContent.jsx";
import FilterBar from "/imports/client/lib/FilterBar.jsx";
import ReportCreate from "./ReportCreate.jsx";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/reports/queries/reportsList";
import Loading from "/imports/client/lib/ui/Loading";
import { objectFromArray } from "/imports/api/utils";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import PagerService from "../../lib/PagerService";
import substatesQuery from "/imports/api/substates/queries/listSubstates";

class ReportListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      reportsSelected: [],
      currentReport: null,
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      substates: []
    });
    this.query = query;
  }

  componentWillMount() {
    this.nextPage(0);
    substatesQuery
      .clone({
        filters: { status: true }
      })
      .fetch((err, substates) => {
        if (!err) {
          this.setState({ substates });
        }
      });
  }

  componentWillReceiveProps(newProps) {
    const { queryParams } = FlowRouter.current();
    if (queryParams.name && queryParams.name == "") {
      this.setPagerInitial();
    }
    this.updatePager();
  }

  setPagerInitial = () => {
    this.setState(
      {
        page: 1,
        perPage: 13,
        total: 0
      },
      () => {
        this.nextPage(0);
      }
    );
  };

  setReport = _id => {
    const { currentReport } = this.state;

    if (currentReport === _id) {
      this.setState({ currentReport: null });
    } else {
      this.setState({
        currentReport: _id,
        create: false
      });
    }
  };

  selectReport = _id => {
    const { reportsSelected } = this.state;
    if (reportsSelected.includes(_id)) {
      reportsSelected.splice(reportsSelected.indexOf(_id), 1);
    } else {
      reportsSelected.push(_id);
    }
    this.setState({ reportsSelected });
  };

  createForm = () => {
    this.setState({
      currentReport: false,
      create: true
    });
  };

  closeForm = () => {
    this.setState({ create: false });
    this.updatePager();
  };

  deleteAction = () => {
    const { reportsSelected } = this.state;

    Meteor.call("report.deleteMany", reportsSelected, err => {
      if (!err) {
        Notifier.success("Reports deleted !");
        this.setState({
          reportsSelected: []
        });
        this.closeRightPanel();
      }
    });
  };

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentClient: null });
  };

  closeRightPanel = () => {
    this.setState({
      create: false,
      currentReport: null
    });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  render() {
    const { data, loading, error } = this.props;
    const {
      reportsSelected,
      currentReport,
      create,
      total,
      range,
      substates
    } = this.state;
    const report = objectFromArray(data, currentReport);

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }

    return (
      <div className="cc-container">
        <div
          className={
            currentReport || create ? "left__side" : "left__side full__width"
          }
        >
          <ReportSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={reportsSelected.length}
            deleteAction={this.deleteAction}
            hideSort
          />
          <ReportList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            reportsSelected={reportsSelected}
            selectReport={this.selectReport}
            currentReport={currentReport}
            setReport={this.setReport}
            reports={data}
          />
          <PaginationBar
            module="Report"
            close={this.closeForm}
            create={this.createForm}
            nextPage={this.nextPage}
            range={range}
            total={total}
          />
        </div>
        {(currentReport || create) && (
          <RightSide
            close={this.closeForm}
            report={report}
            create={create}
            substates={substates}
          />
        )}
      </div>
    );
  }
}

class RightSide extends Component {
  constructor() {
    super();
    this.state = {
      fade: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 300);
  }

  render() {
    const { report, create, close, substates } = this.props;
    const { fade } = this.state;
    const classes = classNames({
      right__side: true,
      in: fade
    });
    return (
      <div className={classes}>
        {create ? (
          <ReportCreate close={close} substates={substates} />
        ) : (
          <ReportContent substates={substates} report={report} />
        )}
      </div>
    );
  }
}

export default withQuery(
  props => {
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;
    return PagerService.setQuery(query, { page, perPage, filters: {} });
  },
  { reactive: true }
)(ReportListContainer);
