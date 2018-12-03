import React from "react";
import AccountMetaData from "/imports/client/pages/accounts/components/AccountContent/AccountMetaData";
import Notifier from "/imports/client/lib/Notifier";

export default class MetaDataSlider extends React.Component {
  constructor() {
    super();
    this.state = {
      fade: false,
      metadata: {}
    };
  }

  componentWillMount() {
    const { accountId } = this.props;
    Meteor.call("account.getMetadata", accountId, (err, metadata) => {
      if (!err) {
        this.setState({ metadata });
      } else {
        Notifier.error(err.reason);
      }
    });
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
    const { fade, metadata } = this.state;

    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.closeSlider} className="btn-cancel">
              Back
            </button>
          </div>
        </div>
        <AccountMetaData close={this.closeSlider} metadata={metadata} />
      </div>
    );
  }
}
