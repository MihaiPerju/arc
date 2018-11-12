import React, { Component } from "react";
import FileHeader from "./components/FileContent/FileHeader";

export default class FileContent extends Component {
  constructor() {
    super();
  }

  componentWillReceiveProps() {
    this.setState({ edit: false });
  }

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  render() {
    const { file } = this.props;
    return (
      <div className="main-content code-content">
        {
          <div>
            <FileHeader setEdit={this.setEdit} file={file} key={file._id} />
          </div>
        }
      </div>
    );
  }
}
