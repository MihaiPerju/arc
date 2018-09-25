import React, { Component } from 'react';

export default class SettingSingle extends Component {
  constructor() {
    super();
    this.state = {};
  }

  setPage = () => {
    const { page, setPage } = this.props;
    setPage(page);
  }

  render() {
    const { title, icon } = this.props;
    return (
      <div className="list-item" onClick={this.setPage.bind(this)} >
        <div className="row__block align-center" >
          <div className="info">
            {/* <div className="title"> <i className={icon} /> {title}</div> */}
            <div className="settings-title">{title}</div>
          </div>
        </div>
      </div>
    );
  }
}
