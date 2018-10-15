import React, { Component } from "react";
import CodeSingle from "./CodeSingle";

export default class CodeList extends Component {
  render() {
    const { codes } = this.props;
    const codeList = codes.map(function(code) {
      const {
        setCode,
        selectCode,
        codesSelected,
        currentCode,
        tags
      } = this.props;
      return (
        <CodeSingle
          codesSelected={codesSelected}
          currentCode={currentCode}
          selectCode={selectCode}
          setCode={setCode}
          code={code}
          key={code._id}
          tags={tags}
        />
      );
    }, this);
    return <div className={this.props.class}>{codeList}</div>;
  }
}
