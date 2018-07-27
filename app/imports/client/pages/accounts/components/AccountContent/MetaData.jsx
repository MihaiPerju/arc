import React from "react";
import AccountMetaData from "/imports/client/pages/accounts/components/AccountContent/AccountMetaData";

export default class MetaDataSlider extends React.Component {
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

  closeSlider = () => {
    const { closeMetaData } = this.props;
    this.setState({ fade: true });
    closeMetaData();
  };

  render() {
    const { fade } = this.state;
    const { account } = this.props;
    const { metaData } = account;

    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.closeSlider} className="btn-cancel">
              Back
            </button>
          </div>
        </div>
        {account && (
          <AccountMetaData
            close={this.closeSlider}
            metaData={metaData}
          />
        )}
      </div>
    );
  }
}
