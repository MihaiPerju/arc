import React, { Component } from "react";
import FacilityContentHeader from "./components/FacilityContent/FacilityContentHeader";
import ContactTable from "./components/FacilityContent/ContactTable";
import FacilityFiles from "./components/FacilityContent/FacilityFiles";
import PlacementBlock from "./components/FacilityContent/PlacementBlock";
import InventoryBlock from "./components/FacilityContent/InventoryBlock";
import PaymentBlock from "./components/FacilityContent/PaymentBlock";
import FacilityEdit from "/imports/client/pages/clients/facilities/FacilityEdit.jsx";
import userRoles, { roleGroups } from "/imports/api/users/enums/roles";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class FacilityContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      copiedPlacementRules: {},
      inventoryFacility: null,
      resetImportForm: false,
      facilityId: this.props.currentFacility,
      facility: null
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.getFacility();

    this.pollingMethod = setInterval(() => {
      this.getFacility();
    }, 10000);
  }

  getFacility(passedID) {
    const facilityId = passedID ? passedID : this.state.facilityId;
    Meteor.call("facility.getOne", facilityId, (err, facility) => {
      if (!err) {
        this.setState({ facility });
        this.getRules(facility);
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  // WTH is going on here, this is garbage / second state set called by above getFacility(). This needs to be removed.
  getRules(facility) {
    if (facility) {
      const { placementRules } = facility;
      this.setState({
        copiedPlacementRules: placementRules,
        inventoryFacility: facility
      });
    }
  }

  // If account changed we need to go fetch it right away
  componentWillReceiveProps(nextProps) {
    if(nextProps.currentFacility === this.props.currentFacility)
      return;
  
    this.setState({
      edit: false, 
      copiedPlacementRules: {}, 
      inventoryFacility: null, 
      resetImportForm: false, 
      facilityId: nextProps.currentFacility,
      facility: null
    });

    this.getFacility(nextProps.currentFacility);
  }

  componentWillUnmount = () => {
    //Removing Interval
    clearInterval(this.pollingMethod);
  };

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  setTempRules = model => {
    this.setState({ copiedPlacementRules: model });
  };

  copyPlacementRules = () => {
    this.setState({ resetImportForm: true });
    const { copiedPlacementRules } = this.state;
    const { facility } = this.props;
    const tempFacility = _.clone(facility);
    tempFacility.inventoryRules = copiedPlacementRules;
    this.setState({ inventoryFacility: tempFacility });
  };

  changeResetStatus = () => {
    this.setState({ resetImportForm: false });
  };

  render() {
    const { setFacility } = this.props;
    const { facility, edit, inventoryFacility, resetImportForm } = this.state;

    if (!facility) {
      return <Loading />;
    }

    return (
      <div className="main-content facility-content">
        <div className="breadcrumb">
          <ul>
            <li>
              <a href={FlowRouter.url("/client/list")}>Clients</a>
            </li>
            <li>
              <a style={{ pointerEvents: "none", cursor: "default" }}>
                {facility.client && facility.client.clientName}
              </a>
            </li>
            <li>
              <span>{facility.name}</span>
            </li>
          </ul>
        </div>
        {edit ? (
          <FacilityEdit facility={facility} close={this.setEdit} />
        ) : (
          <div>
            <FacilityContentHeader
              onEdit={this.setEdit}
              setFacility={setFacility}
              facility={facility}
            />
            <ContactTable contacts={facility && facility.contacts} />
            {Roles.userIsInRole(Meteor.userId(), roleGroups.ADMIN_TECH) && (
              <FacilityFiles facilityId={facility && facility._id} />
            )}
            {!Roles.userIsInRole(Meteor.userId(), userRoles.MANAGER) && (
              <PlacementBlock
                facility={facility}
                setTempRules={this.setTempRules}
              />
            )}
            {!Roles.userIsInRole(Meteor.userId(), userRoles.MANAGER) && (
              <InventoryBlock
                facility={inventoryFacility}
                copyPlacementRules={this.copyPlacementRules}
                resetImportForm={resetImportForm}
                changeResetStatus={this.changeResetStatus}
              />
            )}
            {!Roles.userIsInRole(Meteor.userId(), userRoles.MANAGER) && (
              <PaymentBlock facility={facility} />
            )}
          </div>
        )}
      </div>
    );
  }
}
