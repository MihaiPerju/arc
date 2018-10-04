import React, { Component } from "react";
import FileSingle from "./FileSingle";

export default class FileList extends Component {
  render() {
    const { files } = this.props;
    const fileList = files.map(function(file) {
      const {
        setFile,
        selectFile,
        filesSelected,
        currentFile,
      } = this.props;
      return (
        <FileSingle
          filesSelected={filesSelected}
          currentFile={currentFile}
          selectFile={selectFile}
          setFile={setFile}
          file={file}
          key={file._id}
        />
      );
    }, this);
    return <div className={this.props.class}>{fileList}</div>;
  }
}
