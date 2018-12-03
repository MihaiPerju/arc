import React, { Component } from "react";
import CodeContent from "./CodeContent.jsx";
import CodeCreate from "./CodeCreate.jsx";

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
      const { fade } = this.state;
      const { currentCode, create, close } = this.props;
      return (
        <div className={fade ? "right__side in" : "right__side"}>
          {create ? <CodeCreate close={close} /> : <CodeContent currentCode={currentCode} />}
        </div>
      );
    }
  }
  