import React, { Component } from "react";
import RuleContent from "./RuleContent.jsx";
import RuleCreate from "./RuleCreate";

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
      const { currentRule, create, close } = this.props;
      return (
        <div className={fade ? "right__side in" : "right__side"}>
          {create ? <RuleCreate close={close} /> : <RuleContent currentRule={currentRule} />}
        </div>
      );
    }
  }