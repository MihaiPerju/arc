import React from "react";
import {
  AutoForm,
  AutoField,
  ErrorField,
  LongTextField,
  SelectField,
  ListField,
  ListItemField,
  NestField
} from "/imports/ui/forms";
import ActionSchema from "/imports/api/actions/schemas/schema";
import Notifier from "/imports/client/lib/Notifier";
import ReasonCodesBlock from "./components/ReasonCodesBlock";
import RolesEnum from "/imports/api/users/enums/roles.js";
import SelectSimple from "/imports/client/lib/uniforms/SelectSimple.jsx";
import inputTypesEnum from "/imports/api/actions/enums/inputTypeEnum";
import requirementTypes from "/imports/api/actions/enums/requirementEnum";

export default class ActionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      error: null,
      checked: false,
      isDisabled: false,
      action: null
    };
  }

  componentWillMount() {
    this.updateProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.action._id === this.props.action._id)
      return;

    this.updateProps(nextProps);
  }

  onSubmit(formData) {
    const { action } = this.props;
    const { value } = formData.substateId || {};
    formData.substateId = value;
    this.setState({ isDisabled: true });

    Meteor.call("action.edit", action._id, formData, err => {
      if (!err) {
        Notifier.success("Data saved!");
        this.onSetEdit();
      } else {
        Notifier.error("An error occurred!");
      }
      this.setState({ isDisabled: false });
    });
  }

  getOptions = enums => {
    return _.map(enums, value => {
      const label = `${value.stateName}: ${value.name}`;
      return { value: value._id, label: label };
    });
  };

  updateProps(props) {
    if (props.action) {
      this.setState({
        checked: !!props.action.substateId
      });
    }
  }

  handleClick() {
    if (!Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
      this.setState({
        checked: !this.state.checked
      });
    }
  }

  onEditAction = () => {
    this.refs.form.submit();
  };

  onSetEdit = () => {
    this.props.setEdit();
  };

  handleBack = () => {
    FlowRouter.go("/substate/list");
  };

  render() {
    const { action, substates } = this.props;
    const { checked, isDisabled } = this.state;
    const substatesOptions = this.getOptions(substates);
    const { id } = FlowRouter.current().params;
    const requirementOptions = [
      { label: requirementTypes.OPTIONAL, value: requirementTypes.OPTIONAL },
      { label: requirementTypes.MANDATORY, value: requirementTypes.MANDATORY }
    ];

    return (
      <div ref="forms" className="create-form">
        <div className="create-form__bar">
          {id && (
            <button onClick={this.handleBack} className="btn-cancel">
              Back
            </button>
          )}
          <div className="btn-group">
            <button onClick={this.onSetEdit} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.onEditAction}
              className="btn--green"
            >
              {isDisabled ? (
                <div>
                  {" "}
                  Loading
                  <i className="icon-cog" />
                </div>
              ) : (
                "Confirm & Save"
              )}
            </button>
          </div>
        </div>

        <div className="create-form__wrapper">
          <div className="action-block">
            <div className="header__block">
              <div className="title-block text-uppercase">
                Action information
              </div>
            </div>
            <div className="arcc-form-wrap">
              <AutoForm
                disabled={Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)}
                schema={ActionSchema}
                onSubmit={this.onSubmit.bind(this)}
                ref="form"
                model={action}
              >
                {this.state.error && (
                  <div className="error">{this.state.error}</div>
                )}
                <div className="form-wrapper">
                  <AutoField
                    labelHidden={true}
                    placeholder="Title"
                    name="title"
                  />
                  <ErrorField name="title" />
                </div>

                <div className="form-wrapper">
                  <LongTextField
                    labelHidden={true}
                    placeholder="Description"
                    name="description"
                  />
                  <ErrorField name="description" />
                </div>

                <div className="check-group">
                  <input checked={checked} type="checkbox" />
                  <label onClick={this.handleClick}>
                    Changes the substate of the Account?
                  </label>
                </div>

                {checked && (
                    <div className="select-group">
                      <div className="form-wrapper">
                        <SelectSimple
                          disabled={Roles.userIsInRole(
                            Meteor.userId(),
                            RolesEnum.MANAGER
                          )}
                          placeholder="Substate"
                          labelHidden={true}
                          name="substateId"
                          options={substatesOptions}
                        />
                        <ErrorField name="substateId" />
                      </div>
                    </div>
                )}

                  <ListField name="inputs">
                    <ListItemField name="$">
                      <NestField className="upload-item text-center">
                        <div className="form-wrapper">
                          <SelectField
                            placeholder="Select type"
                            labelHidden={true}
                            options={inputTypesEnum}
                            name="type"
                          />
                          <ErrorField name="type" />
                        </div>

                        <div className="form-wrapper">
                          <AutoField
                            labelHidden={true}
                            name="label"
                            placeholder="label"
                          />
                          <ErrorField name="label" />
                        </div>

                        <div className="form-wrapper">
                          <SelectField
                            labelHidden={true}
                            name="requirement"
                            options={requirementOptions}
                            label="Mandatory"
                          />
                        </div>
                      </NestField>
                    </ListItemField>
                  </ListField>
                </AutoForm>
              </div>
            </div>

          <ReasonCodesBlock action={action} />
          {Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER) && (
            <ReasonCodesBlock isPrivate action={action} />
          )}
        </div>
      </div>
    );
  }
}
