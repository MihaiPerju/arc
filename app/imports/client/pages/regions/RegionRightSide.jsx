import React, { Component } from "react";
import RegionContent from "./RegionContent.jsx";
import RegionCreate from "./RegionCreate";

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
    const { currentRegion, create, close } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <RegionCreate close={close} />
        ) : (
          <RegionContent currentRegion={currentRegion} />
        )}
      </div>
    );
  }
}
