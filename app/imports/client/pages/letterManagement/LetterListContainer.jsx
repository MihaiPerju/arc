import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import LetterList from "./components/LetterList";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/letters/queries/letterList.js";
import Loading from "/imports/client/lib/ui/Loading";
import PagerService from "../../lib/PagerService";
import Pager from "../../lib/Pager";
import LetterManagementDropzone from "./components/LetterManagementDropzone";
import LetterSearchBar from "./components/LetterSearchBar";
import moduleTagsQuery from "/imports/api/moduleTags/queries/listModuleTags";
import { moduleNames } from "/imports/client/pages/moduleTags/enums/moduleList";

class LetterListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      moduleTags: []
    });
    this.query = query;
  }

  componentWillMount() {
    this.nextPage(0);
    this.getModuleTags();
  }

  componentWillReceiveProps(newProps) {
    const { queryParams } = FlowRouter.current();
    if (queryParams.letterIds && queryParams.letterIds == "") {
      this.setPagerInitial();
    }
    this.updatePager();
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

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  getModuleTags = () => {
    moduleTagsQuery
      .clone({
        filters: { moduleNames: { $in: [moduleNames.LETTERS] } }
      })
      .fetch((err, moduleTags) => {
        if (!err) {
          this.setState({ moduleTags });
        }
      });
  };

  render() {
    const { data, isLoading, error } = this.props;
    const { total, range, create, moduleTags } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <div>{error.reason}</div>;
    }
    return (
      <div className="cc-container">
        <div className={create ? "left__side" : "left__side full__width"}>
          <LetterSearchBar
            setPagerInitial={this.setPagerInitial}
            moduleTags={moduleTags}
          />
          <LetterList letters={data} moduleTags={moduleTags} />
          <PaginationBar
            module="Letter Management File"
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
        <LetterManagementDropzone close={close} />
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
)(LetterListContainer);
