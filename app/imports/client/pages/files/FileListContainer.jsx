import React, { Component } from "react";
import FileList from "./components/FileList.jsx";
import FileSearchBar from "./components/FileSearchBar.jsx";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import FileContent from "./FileContent.jsx";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/files/queries/listFiles";
import Loading from "/imports/client/lib/ui/Loading";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import PagerService from "../../lib/PagerService";

class FileListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      filesSelected: [],
      currentFile: null,
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
    const { queryParams } = FlowRouter.current();
    if (queryParams.file && queryParams.file == "") {
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

  setFile = _id => {
    const { currentFile } = this.state;

    if (currentFile === _id) {
      this.setState({ currentFile: null });
    } else {
      this.setState({ currentFile: _id, create: false });
    }
  };

  selectFile = _id => {
    const { filesSelected } = this.state;
    if (filesSelected.includes(_id)) {
      filesSelected.splice(filesSelected.indexOf(_id), 1);
    } else {
      filesSelected.push(_id);
    }
    this.setState({ filesSelected });
  };

  createForm = () => {
    this.setState({
      currentFile: false,
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
    const { filesSelected } = this.state;

    Meteor.call("file.deleteMany", filesSelected, err => {
      if (!err) {
        Notifier.success("Files deleted !");
        this.setState({
          filessSelected: []
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
      currentFile: null
    });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  getFile = () => {
    const { data } = this.props;
    const { currentFile } = this.state;
    for (let file of data) {
      if (file._id === currentFile) {
        return file;
      }
    }
  };

  render() {
    const { data, isLoading, error } = this.props;
    const { filesSelected, currentFile, create, range, total } = this.state;
    const file = this.getFile(currentFile);

    if (isLoading && !FlowRouter.getQueryParam("fileName")) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }
    return (
      <div className="cc-container">
        <div
          className={
            currentFile || create ? "left__side" : "left__side full__width"
          }
        >
          <FileSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={filesSelected.length}
            deleteAction={this.deleteAction}
            hideSort
            hideFilter
          />
          <FileList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            filesSelected={filesSelected}
            selectFile={this.selectFile}
            currentFile={currentFile}
            setFile={this.setFile}
            files={data}
          />
          <PaginationBar
            create={this.createForm}
            nextPage={this.nextPage}
            module="File"
            range={range}
            total={total}
          />
        </div>
        {(currentFile || create) && (
          <RightSide file={file} create={create} close={this.closeForm} />
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
    const { file, create, close } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <FileContent file={file} />
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
)(FileListContainer);
