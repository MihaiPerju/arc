import React, { Component } from "react";
import FacilityContent from "./FacilityContent.jsx";
import FacilityCreate from "./FacilityCreate.jsx";

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
    const { currentFacility, create, close, setFacility } = this.props;

    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <FacilityCreate close={close} />
        ) : (
          <FacilityContent
            setFacility={setFacility}
            currentFacility={currentFacility}
          />
        )}
      </div>
    );
  }
}
