import React from "react";
import CodeList from "./components/CodeList.jsx";
import CodeSearchBar from "./components/CodeSearchBar.jsx";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import ParamsService from "../../lib/ParamsService";
import { moduleNames } from "/imports/api/tags/enums/tags";
import RightSide from "./CodeRightSide";
import Loading from "/imports/client/lib/ui/Loading";

export default class CodeListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      codesSelected: [],
      currentCode: null,
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      tags: [],
    });
    this.method = "codes.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);
    this.getTags();

    this.pollingMethod = setInterval(() => {
      this.listCodes();
    }, 3000);
  }

  listCodes = () => {
    const params = ParamsService.getCodesParams();
    Meteor.call("codes.get", params, (err, codes) => {
      if (!err) {
        this.setState({ codes });
        this.updatePager();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
  }

  componentWillReceiveProps() {
    const { queryParams } = FlowRouter.current();
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
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentClient: null });

    this.listCodes();
  };

  closeRightPanel = () => {
    this.setState({
      create: false,
      currentCode: null
    });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = ParamsService.getCodesParams();
    this.recount(queryParams);
  };

  getTags = () => {
    Meteor.call(
      "tags.get",
      { entities: { $in: [moduleNames.CODES] } },
      (err, tags) => {
        if (!err) {
          this.setState({ tags });
        } else {
          Notifier.error(err.reason);
        }
      }
    );
  };

  render() {
    const {
      codesSelected,
      currentCode,
      create,
      range,
      total,
      tags,
      codes
    } = this.state;

    if(!codes){
      return <Loading/>
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
            tags={tags}
            hideSort
            hideFilter
          />
          <CodeList
            class={
              this.state.filter
                ? "task-list codes decreased"
                : "task-list codes"
            }
            codesSelected={codesSelected}
            selectCode={this.selectCode}
            currentCode={currentCode}
            setCode={this.setCode}
            codes={codes}
            tags={tags}
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
          <RightSide
            currentCode={currentCode}
            create={create}
            close={this.closeForm}
          />
        )}
      </div>
    );
  }
}
