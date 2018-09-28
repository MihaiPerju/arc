import React from 'react';
import AccountMetaData
  from '/imports/client/pages/accounts/components/AccountContent/AccountMetaData';
import query from '/imports/api/accounts/queries/accountList';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import Loading from '/imports/client/lib/ui/Loading';

class MetaDataSlider extends React.Component {
  constructor () {
    super ();
    this.state = {
      fade: false,
    };
  }

  componentDidMount () {
    setTimeout (() => {
      this.setState ({fade: true});
    }, 300);
  }

  closeSlider = () => {
    const {closeMetaData} = this.props;
    this.setState ({fade: true});
    closeMetaData ();
  };

  render () {
    const {isLoading, error, data} = this.props;
    const {fade} = this.state;
    if (isLoading) {
      return <Loading />;
    }
    if (error) {
      return <div>{error.reason}</div>;
    }
    const {metaData} = data;

    return (
      <div className={fade ? 'right__side in' : 'right__side'}>
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.closeSlider} className="btn-cancel">
              Back
            </button>
          </div>
        </div>
        <AccountMetaData close={this.closeSlider} metaData={metaData} />
      </div>
    );
  }
}

export default withQuery (
  props => {
    const {accountId} = props;
    return query.clone ({filters: {_id: accountId}});
  },
  {single: true}
) (MetaDataSlider);
