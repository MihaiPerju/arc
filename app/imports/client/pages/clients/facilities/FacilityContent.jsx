import React, { Component } from "react";
import FacilityContentHeader from "./components/FacilityContent/FacilityContentHeader";
import ContactTable from "./components/FacilityContent/ContactTable";
import FacilityFiles from "./components/FacilityContent/FacilityFiles";
import PlacementBlock from "./components/FacilityContent/PlacementBlock";
import InventoryBlock from "./components/FacilityContent/InventoryBlock";
import PaymentBlock from "./components/FacilityContent/PaymentBlock";
import FacilityEdit from "/imports/client/pages/clients/facilities/FacilityEdit.jsx";
import { roleGroups } from "/imports/api/users/enums/roles";

export default class FacilityContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      copiedPlacementRules: {},
      inventoryFacility: null,
      resetImportForm: false
    };
  }

  componentWillMount() {
    console.log("Mounted");
    const { facility } = this.props;
    const { placementRules } = facility;
    this.setState({
      copiedPlacementRules: placementRules,
      inventoryFacility: facility
    });
  }

  componentWillReceiveProps(props) {
    console.log(props);
    this.setState({ edit: false });
  }

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
    const { facility, setFacility } = this.props;
    const { edit, inventoryFacility, resetImportForm } = this.state;
    if (!facility) {
      console.log("Ok");
      return <div>No Facility Selected</div>;
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
                {facility.client.clientName}
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
            <PlacementBlock
              facility={facility}
              setTempRules={this.setTempRules}
            />
            {/* <InventoryBlock
              facility={inventoryFacility}
              copyPlacementRules={this.copyPlacementRules}
              resetImportForm={resetImportForm}
              changeResetStatus={this.changeResetStatus}
            />
            <PaymentBlock facility={facility} /> */}
          </div>
        )}
      </div>
    );
  }
}
