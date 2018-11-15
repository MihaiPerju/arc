import React, { Component } from "react";

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      assignedList: [],
    };
  }

  render() {
    return(
      
      <div className="dashboard-row">
        <div className="dashboard-section">
          <div className="dashboard-section-header m-t--5">
            <div className="dashboard-section-title">
              Assigned To Me
            </div>
          </div>
          <div className="dashboard-section-content">
            
          </div>
        </div>
        </div>
     
    );
  }
}