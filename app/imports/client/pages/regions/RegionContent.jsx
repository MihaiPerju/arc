import React, { Component } from "react";
import RegionEdit from "/imports/client/pages/regions/RegionEdit.jsx";
import { roleGroups } from "/imports/api/users/enums/roles";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class RegionContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.getRegion();
    this.pollingMethod = setInterval(() => {
      this.getRegion();
    }, 3000);
  }

  getRegion() {
    const { currentRegion } = this.props;
    Meteor.call("region.getOne", currentRegion, (err, region) => {
      if (!err) {
        this.setState({ region });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentWillUnmount = () => {
    //Removing Interval
    clearInterval(this.pollingMethod);
  };
  componentWillReceiveProps(newProps) {
    if(this.state.region && this.state.region._id !== newProps.currentRegion) {
      this.setState({ edit: false, region: null });
      this.getRegion();
    }
  }

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  render() {
    const { edit, region } = this.state;

    if (!region) {
      return <Loading />;
    }

    return (
      <div>
        {edit ? (
          <RegionEdit region={region} close={this.setEdit} />
        ) : (
          <div className="main-content flex-content region-content">
            <div className="main-content flex-content region-content">
              <div className="intro-block text-center">
                <i className="icon-globe" />
                <div className="text-light-grey">Region name</div>
                <div className="region">{region.name}</div>
              </div>
              {Roles.userIsInRole(Meteor.userId(), roleGroups.ADMIN_TECH) && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={this.setEdit}
                    className="btn-edit btn--white"
                  >
                    Edit region
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
