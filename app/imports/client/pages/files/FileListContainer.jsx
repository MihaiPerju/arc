import React, { Component } from "react";
import FileList from "./components/FileList.jsx";
import FileSearchBar from "./components/FileSearchBar.jsx";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import FileContent from "./FileContent.jsx";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import ParamsService from "../../lib/ParamsService";

export default class FileListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      filesSelected: [],
      currentFile: null,
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      files: []
    });
    this.method = "files.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);

    this.pollingMethod = setInterval(() => {
      this.listFiles();
    }, 3000);
  }

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
  }

  listFiles = () => {
    const params = ParamsService.getFilesParams();
    Meteor.call("files.list", params, (err, files) => {
      if (!err) {
        this.setState({ files });
        this.updatePager();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillReceiveProps() {
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
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentClient: null });
    
    this.listFiles();
  };

  closeRightPanel = () => {
    this.setState({
      create: false,
      currentFile: null
    });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = ParamsService.getFilesParams();
    this.recount(queryParams);
  };

  getFile = () => {
    const { currentFile, files } = this.state;
    for (let file of files) {
      if (file._id === currentFile) {
        return file;
      }
    }
  };

  render() {
    const {
      filesSelected,
      currentFile,
      create,
      range,
      total,
      files
    } = this.state;
    const file = this.getFile(currentFile);

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
            close={this.closeRightPanel}
            hideFilter
          />
          <FileList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            filesSelected={filesSelected}
            selectFile={this.selectFile}
            currentFile={currentFile}
            setFile={this.setFile}
            files={files}
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
    const { file } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <FileContent file={file} />
      </div>
    );
  }
}
