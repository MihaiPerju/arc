import React from "react";
import {
  AutoForm,
  AutoField,
  ErrorField,
  RadioField,
  ListField,
  ListItemField,
  NestField
} from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import PropTypes from "prop-types";
import RulesService from "/imports/client/pages/clients/facilities/services/ImportingRulesService";
import Loading from "/imports/client/lib/ui/Loading";
import UploadItem from "./FacilityContent/UploadItem";
import InsuranceRules from "./InsuranceRules";
import classNames from "classnames";
import DatePicker from "react-datepicker";
import moment from "moment";

export default class ImportingRules extends React.Component {
  constructor() {
    super();
    this.state = { loading: true, collapse: false, isDisabled: false, placementDate: null, inventoryDate: null };
  }

  componentWillMount() {
    const { model, rules } = this.props;
    const schema = RulesService.createSchema(
      rules,
      model && model[rules] && model[rules].hasHeader
    );
    this.setState({
      loading: false,
      schema
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.resetImportForm) {
      const { form } = this.refs;
      const { changeResetStatus } = this.props;
      form.reset();
      changeResetStatus();
    }
  }

  onSubmitImportingRules = importRules => {
    this.setState({ isDisabled: true })
    importRules['account.placementDate'] =  moment(this.state.placementDate).format("MM/DD/YYYY hh:mm");
   
     const facilityId = this.props.model._id;
    const { rules } = this.props;
    const newFacility = { _id: facilityId };
    newFacility[rules] = importRules;
    Meteor.call("facility.update", newFacility, err => {
      if (!err) {
        Notifier.success("Facility updated!");
        // this.props.updateFacility();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    }); 
  };

  onChange(field, value) {
    const { rules } = this.props;
     if (field === "hasHeader") {
      //Change schema
      const newSchema = RulesService.createSchema(rules, value);
      
      this.setState({ schema: newSchema });
    }     
  }

  groupFields(fields) {
    const numInRow = 4;
    const numGroups = Math.round(fields.length / numInRow);
    let result = [];
    for (let i = 0; i < numGroups; i++) {
      const startIndex = i * numInRow;
      const finishIndex = Math.min((i + 1) * numInRow, fields.length);
      const groupOfFields = fields.slice(startIndex, finishIndex);
      result.push(groupOfFields);
    }
    return result;
  }

  toggleInsurances = () => {
    const { collapse } = this.state;

    this.setState({ collapse: !collapse });
  };

  showListField = () => {
    this.setState({ collapse: false });
  };

  onChangeModel = model => {
    const { rules, setTempRules } = this.props;
    if (rules === "placementRules") {
      setTempRules(model);
    }
  };

  onDateSelect = (selectedDate, field) => { 
    const { rules } = this.props
    if (field === "placementDate") 
      this.setState({ placementDate: selectedDate });     

    if (field === "inventoryDate") 
      this.setState({ inventoryDate: selectedDate });

  }

  render() {
    const { schema, loading, collapse, isDisabled, placementDate, inventoryDate } = this.state;
    const { model, rules, copyRules } = this.props;
    const fields = RulesService.getSchemaFields(rules);
    console.log(schema);
    const options = [
      { value: true, label: "True" },
      { value: false, label: "False" }
    ];

    const fieldGroups = this.groupFields(fields);
    const btnCollapseClasses = classNames({
      "btn-collapse": true,
      rotate: collapse
    });
    
    return (
      <div>
        {loading ? (
          <Loading />
        ) : (
          <AutoForm
            model={model[rules]}
            schema={schema}
            onChange={this.onChange.bind(this)}
            onSubmit={this.onSubmitImportingRules}
            onChangeModel={this.onChangeModel}
            ref="form"
          >
            <div className="form-wrapper">
              <div className="upload-section placement-header flex--helper flex-justify--space-between flex-align--center">
                <div className="radio-group flex--helper">
                  <label>File with header:</label>
                  <RadioField
                    className="radio-group__wrapper"
                    name="hasHeader"
                    options={options}
                    labelHidden={true}
                  />
                  <ErrorField name="hasHeader" />
                </div>
                {rules == "placementRules" && (
                  <div className="radio-group flex--helper flex-align--center">
                    <label>Account Placement Date:</label>
                    <DatePicker
                        calendarClassName="cc-datepicker"
                        showMonthDropdown
                        showYearDropdown
                        yearDropdownItemNumber={4}
                        todayButton={"Today"}
                        placeholderText="Account Placement Date"
                        selected={placementDate}
                        name="account.placementDate"
                        onChange={date =>
                          this.onDateSelect(date, "placementDate")
                        }
                      />
                  </div>
                  )
                }
                {rules == "inventoryRules" && (
                  <div className="radio-group flex--helper flex-align--center">
                    <label>Account Placement Date:</label>
                    <DatePicker
                        calendarClassName="cc-datepicker"
                        showMonthDropdown
                        showYearDropdown
                        yearDropdownItemNumber={4}
                        name="account.inventoryDate"
                        todayButton={"Today"}
                        placeholderText="Account Inventory Date"
                        selected={inventoryDate}
                        onChange={date =>
                          this.onDateSelect(date, "inventoryDate")
                        }
                      />
                  </div>
                  )
                }

                {rules != "paymentRules" && (
                  <button
                    type="button"
                    className="btn--white"
                    onClick={copyRules}
                  >
                    Copy file headers
                  </button>
                )}
              </div>
            </div>

            <div className="upload-list">
              {fieldGroups &&
                fieldGroups.map((fields,index) => {
                  return <UploadItem fields={fields} key={index}/>;
                })}
            </div>

            <div className="upload-list">
              {schema._schemaKeys.includes("insurances") ? (
                <div className="add-insurance__section">
                  <span
                    className={btnCollapseClasses}
                    onClick={this.toggleInsurances}
                  >
                    {collapse ? "show" : "hide"}
                  </span>
                  <InsuranceRules
                    collapse={collapse}
                    showListField={this.showListField}
                  />
                </div>
              ) : (
                <ListField name="newInsBal" showListField={this.showListField}>
                  <ListItemField name="$">
                    <NestField className="upload-item text-center">
                      <div>
                        <AutoField className="text-light-grey" name="insBal" />
                        <ErrorField name="insBal" />
                      </div>
                    </NestField>
                  </ListItemField>
                </ListField>
              )}
            </div>

            <div className="btn-group">
              <button
                style={isDisabled ? { cursor: "not-allowed" } : {}}
                disabled={isDisabled}
                className="btn--green"
              >
                {isDisabled ? (
                  <div>
                    {" "}
                    Loading
                    <i className="icon-cog" />
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </AutoForm>
        )}
      </div>
    );
  }
}

ImportingRules.propTypes = {
  model: PropTypes.object
};
