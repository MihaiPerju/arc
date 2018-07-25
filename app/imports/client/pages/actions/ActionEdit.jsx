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

export default class ActionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      error: null,
      checked: false
    };
  }

  onSubmit(formData) {
    const { action } = this.props;
    const { value } = formData.substateId || {};
    formData.substateId = value;
    
    Meteor.call("action.edit", action._id, formData, err => {
      if (!err) {
        Notifier.success("Data saved!");
        this.onSetEdit();
      } else {
        Notifier.error("An error occurred!");
      }
    });
  }

  getOptions = enums => {
    return _.map(enums, (value, key) => {
      const label = `${value.stateName}: ${value.name}`;
      return { value: value._id, label: label };
    });
  };

  updateProps(props) {
    const { action } = props;
    if (action) {
      this.setState({
        checked: !!action.substateId
      });
    }
  }

  componentWillReceiveProps(props) {
    this.updateProps(props);
  }

  componentWillMount() {
    this.updateProps(this.props);
  }

  handleClick() {
    const currentState = this.state.checked;
    this.setState({
      checked: !currentState
    });
  }

  onEditAction = () => {
    const { form } = this.refs;
    form.submit();
  };

  onSetEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  handleBack = () => {
    FlowRouter.go("/substate/list");
  };

  render() {
    const { action, substates } = this.props;
    const { checked } = this.state;
    const substatesOptions = this.getOptions(substates);
    const inputTypes = [
      { value: "number", label: "number" },
      { value: "date", label: "date" },
      { value: "string", label: "text" }
    ];

    const { id } = FlowRouter.current().params;

    return (
      <div className="create-form">
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
            <button onClick={this.onEditAction} className="btn--green">
              Confirm & save
            </button>
          </div>
        </div>

        {action && (
          <div className="create-form__wrapper">
            <div className="action-block">
              <div className="header__block">
                <div className="title-block text-uppercase">
                  Action information
                </div>
              </div>

              <AutoForm
                model={action}
                schema={ActionSchema}
                onSubmit={this.onSubmit.bind(this)}
                ref="form"
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
                    {" "}
                    Changes the substate of the Account?
                  </label>
                </div>

                {checked && (
                  <div className="select-group">
                    <div className="form-wrapper">
                      <SelectSimple
                        placeholder="Substate"
                        labelHidden={true}
                        name="substateId"
                        options={substatesOptions}
                      />
                      <ErrorField name="substateId" />
                    </div>
                  </div>
                )}

                <ListField name="inputs" showListField={() => {}}>
                  <ListItemField name="$">
                    <NestField className="upload-item text-center">
                      <div className="form-wrapper">
                        <SelectField
                          placeholder="Select type"
                          labelHidden={true}
                          options={inputTypes}
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
                    </NestField>
                  </ListItemField>
                </ListField>
              </AutoForm>
            </div>

            <ReasonCodesBlock action={action} />
            {Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER) && (
              <ReasonCodesBlock isPrivate action={action} />
            )}
          </div>
        )}
      </div>
    );
  }
}
