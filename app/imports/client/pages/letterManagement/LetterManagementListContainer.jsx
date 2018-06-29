import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
// import LetterSearchBar from "./components/LetterSearchBar.jsx";
import LetterManagementList from "./components/LetterManagementList.jsx";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/letters/queries/letterList.js";
import Loading from "/imports/client/lib/ui/Loading";
// import { objectFromArray } from "/imports/api/utils";
import Notifier from "/imports/client/lib/Notifier";
import PagerService from "../../lib/PagerService";
import Pager from "../../lib/Pager";
import CreateDropZone from './components/CreateDropZone'


class LetterManagementListContainer extends Pager {
  constructor() {
    super();

    _.extend(this.state, {
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {}
    });
    this.query = query;
  }

  componentWillMount() {
    this.nextPage(0);
  }

  createForm = () => {
    this.setState({
      create: true
    });
  };

  closeForm = () => {
    this.setState({
      create: false
    });
  };

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage });
  };

  render() {
    const { data, loading, error } = this.props;
    const { total, range, create } = this.state;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <div>{error.reason}</div>;
    }
    return (
      <div className="cc-container">
        <div className={create ? "left__side" : "left__side full__width"}>
          <LetterManagementList letters={data} />
          <PaginationBar
            module="Client"
            create={this.createForm}
            closeForm={this.closeForm}
            nextPage={this.nextPage}
            range={range}
            total={total}
            create={this.createForm}
          />
        </div>
        {create && <RightSide create={create} close={this.closeForm} />}
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
    const { create, close } = this.props;
    const { fade } = this.state;

    return (
      <div className={fade ? "right__side in" : "right__side"}>
          <CreateDropZone close={close} />
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
)(LetterManagementListContainer);
