import React, { Component } from "react";
import CodeList from "./components/CodeList.jsx";
import CodeSearchBar from "./components/CodeSearchBar.jsx";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import CodeContent from "./CodeContent.jsx";
import CodeCreate from "./CodeCreate.jsx";
import FilterBar from "/imports/client/lib/FilterBar.jsx";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/codes/queries/listCodes";
import Loading from "/imports/client/lib/ui/Loading";
import { objectFromArray } from "/imports/api/utils";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import PagerService from "../../lib/PagerService";

class CodeListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      codesSelected: [],
      currentCode: null,
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

  componentWillReceiveProps(newProps) {
    const {queryParams} = FlowRouter.current();
    if (queryParams.code && queryParams.code == "") {
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

  showFilterBar() {
    this.setState({
      filter: !this.state.filter
    });
  }

  setCode = _id => {
    const { currentCode } = this.state;

    if (currentCode === _id) {
      this.setState({ currentCode: null });
    } else {
      this.setState({ currentCode: _id, create: false });
    }
  };

  selectCode = _id => {
    const { codesSelected } = this.state;
    if (codesSelected.includes(_id)) {
      codesSelected.splice(codesSelected.indexOf(_id), 1);
    } else {
      codesSelected.push(_id);
    }
    this.setState({ codesSelected });
  };

  createForm = () => {
    this.setState({
      currentCode: false,
      create: true,
      rightSide: true
    });
  };

  closeForm = () => {
    this.setState({
      create: false
    });
    this.updatePager();
  };

  deleteAction = () => {
    const { codesSelected } = this.state;

    Meteor.call("code.deleteMany", codesSelected, err => {
      if (!err) {
        Notifier.success("Codes deleted !");
        this.setState({
          codesSelected: []
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
      currentCode: null
    });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  render() {
    const { data, loading, error } = this.props;
    const { codesSelected, currentCode, create, range, total } = this.state;
    const code = objectFromArray(data, currentCode);

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
            currentCode || create ? "left__side" : "left__side full__width"
          }
        >
          <CodeSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={codesSelected.length}
            deleteAction={this.deleteAction}
            hideSort
          />
          <CodeList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            codesSelected={codesSelected}
            selectCode={this.selectCode}
            currentCode={currentCode}
            setCode={this.setCode}
            codes={data}
          />
          <PaginationBar
            create={this.createForm}
            nextPage={this.nextPage}
            module="Code"
            range={range}
            total={total}
          />
        </div>
        {(currentCode || create) && (
          <RightSide code={code} create={create} close={this.closeForm} />
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
    const { fade } = this.state;
    const { code, create, close } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? <CodeCreate close={close} /> : <CodeContent code={code} />}
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
)(CodeListContainer);
