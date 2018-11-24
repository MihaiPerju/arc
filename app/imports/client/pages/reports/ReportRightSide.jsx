import React, { Component } from "react";
import ReportContent from "./ReportContent.jsx";
import ReportCreate from "./ReportCreate.jsx";
import classNames from "classnames";

export default class RightSide extends Component {
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
      const { currentReport, create, close, substates, closeRightPanel } = this.props;
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
            <ReportContent
              closeRightPanel={closeRightPanel}
              substates={substates}
              currentReport={currentReport}
            />
          )}
        </div>
      );
    }
  }
  