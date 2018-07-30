import React from "react";
import SimpleSchema from "simpl-schema";
import accountActionsQuery from "/imports/api/accountActions/queries/accountActionList";
import { Timeline, TimelineEvent } from "react-event-timeline";
import moment from "moment";
import UserService from "./services/UserService";
import { AutoForm, SelectField } from "/imports/ui/forms";
import actionTypesEnum, {
  typeList
} from "/imports/api/accounts/enums/actionTypesEnum";
import Loading from "/imports/client/lib/ui/Loading";

export default class ActivityStream extends React.Component {
  constructor() {
    super();
    this.state = {
      accountActions: [],
      filter: false,
      model: {},
      limit: 20,
      skip: 0,
      isScrollLoading: false
    };
  }

  componentWillMount() {
    const actionTypes = [];
    const { userId } = FlowRouter.current().params;
    const { limit, skip } = this.state;

    typeList.map(type => {
      actionTypes.push({ label: type, value: type });
    });
    this.getActions(userId, limit, skip);
    this.setState({ actionTypes });
  }

  componentDidMount() {
    const { isScroll } = this.refs;
    if (isScroll) {
      isScroll.addEventListener("scroll", this.onHandleScroll);
    }
  }

  onHandleScroll = () => {
    const { skip, accountActions } = this.state;
    const { isScroll } = this.refs;
    const { scrollTop, scrollHeight, clientHeight } = isScroll;
    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    if (scrolledToBottom && skip <= accountActions.length) {
      this.setState({ isScrollLoading: true });
      this.loadMoreItems();
    }
  };

  loadMoreItems = () => {
    let { limit, skip } = this.state;
    const { userId } = FlowRouter.current().params;
    skip = skip + limit;
    this.setState({ limit, skip });
    this.getActions(userId, limit, skip);
  };

  componentWillReceiveProps(props) {
    // set the limit to initial value
    this.setState({ limit: 20, skip: 0, accountActions: [] });
    const { userId } = FlowRouter.current().params;
    const { limit, skip } = this.state;

    this.getActions(userId, limit, skip);
  }

  getActions = (id, limit, skip) => {
    const params = UserService.getActionsQueryParams(id);
    _.extend(params, {
      options: { limit, skip }
    });

    accountActionsQuery.clone(params).fetch((err, actions) => {
      if (!err) {
        let { accountActions } = this.state;
        accountActions = accountActions.concat(actions);
        this.setState({
          accountActions,
          isScrollLoading: false
        });
      }
    });
  };

  getTimelineIcon = type => {
    switch (type) {
      case actionTypesEnum.USER_ACTION:
        return <i className="icon-thumb-tack" />;
      case actionTypesEnum.SYSTEM_ACTION:
        return <i className="icon-alert" />;
      case actionTypesEnum.COMMENT:
        return <i className="icon-comments-o" />;
      case actionTypesEnum.LETTER:
        return <i className="icon-inbox" />;
      case actionTypesEnum.FLAG:
        return <i className="icon-flag" />;
      case actionTypesEnum.EDIT:
        return <i className="icon-pencil" />;
    }
  };

  getTimelineBody = data => {
    const {
      type,
      action,
      reasonCode,
      content,
      acctNum,
      letterTemplate,
      user,
      actionId,
      isOpen,
      flagResponse,
      isFlagApproved,
      manager,
      account,
      fieldUpdatedValue,
      fieldPreviousValue,
      accountField
    } = data;

    switch (type) {
      case actionTypesEnum.USER_ACTION:
        return (
          <div>
            {action && (
              <div>
                {user && (
                  <b>
                    {user.profile.firstName} {user.profile.lastName}
                  </b>
                )}{" "}
                applied action <b>{action.title}</b> to account with account
                number{" "}
                {account && (
                  <a
                    className="text-blue"
                    href={`/accounts/${account.state.toLowerCase()}?accountId=${
                      account._id
                    }`}
                  >
                    {account.acctNum}
                  </a>
                )}
              </div>
            )}
            {reasonCode && <div>Reason Code: {reasonCode}</div>}
          </div>
        );
      case actionTypesEnum.SYSTEM_ACTION:
        return (
          <div>
            {action && (
              <div>
                Applied action <b>{action.title}</b> to account with account
                number <b>{acctNum}</b>
              </div>
            )}
          </div>
        );
      case actionTypesEnum.COMMENT:
        return (
          <div>
            {user && (
              <b>
                {user.profile.firstName} {user.profile.lastName}
              </b>
            )}{" "}
            commented a comment <b>{content}</b> to account with account number{" "}
            {account && (
              <a
                className="text-blue"
                href={`/accounts/${account.state.toLowerCase()}?accountId=${
                  account._id
                }`}
              >
                {account.acctNum}
              </a>
            )}
          </div>
        );
      case actionTypesEnum.LETTER:
        return (
          <div>
            {letterTemplate && (
              <div>
                {user && (
                  <b>
                    {user.profile.firstName} {user.profile.lastName}
                  </b>
                )}{" "}
                send a letter with letter-template name{" "}
                <b>{letterTemplate.name}</b> to account with account number{" "}
                {account && (
                  <a
                    className="text-blue"
                    href={`/accounts/${account.state.toLowerCase()}?accountId=${
                      account._id
                    }`}
                  >
                    {account.acctNum}
                  </a>
                )}
              </div>
            )}
          </div>
        );
      case actionTypesEnum.FLAG:
        return (
          <div>
            {actionId ? (
              <div>
                <b>
                  {user.profile.firstName} {user.profile.lastName}
                </b>{" "}
                flagged an action on account with account number{" "}
                {account && (
                  <a
                    className="text-blue"
                    href={`/accounts/${account.state.toLowerCase()}?accountId=${
                      account._id
                    }`}
                  >
                    {account.acctNum}
                  </a>
                )}
                {!isOpen && (
                  <div>
                    <br />
                    Manager{" "}
                    {manager && (
                      <b>
                        {manager.profile.firstName} {manager.profile.lastName}
                      </b>
                    )}{" "}
                    has responsed to the action and{" "}
                    {isFlagApproved ? <b>approved</b> : <b>rejected</b>} the
                    flag with reason <b>{flagResponse}</b>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <b>
                  {user.profile.firstName} {user.profile.lastName}
                </b>{" "}
                flagged a comment on account with account number{" "}
                {account && (
                  <a
                    className="text-blue"
                    href={`/accounts/${account.state.toLowerCase()}?accountId=${
                      account._id
                    }`}
                  >
                    {account.acctNum}
                  </a>
                )}
                {!isOpen && (
                  <div>
                    <br />
                    Manager{" "}
                    {manager && (
                      <b>
                        {manager.profile.firstName} {manager.profile.lastName}
                      </b>
                    )}{" "}
                    has responsed to a comment and{" "}
                    {isFlagApproved ? <b>approved</b> : <b>rejected</b>} the
                    flag with reason <b>{flagResponse}</b>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case actionTypesEnum.EDIT:
        return (
          <div>
            {fieldPreviousValue ? (
              <div>
                <b>
                  {user.profile.firstName} {user.profile.lastName}
                </b>{" "}
                updated the account <b>{account && account.acctNum}</b> with
                value <b>{fieldPreviousValue}</b> to <b>{fieldUpdatedValue}</b>{" "}
                in the field <b>{accountField}</b>.
              </div>
            ) : (
              <div>
                <b>
                  {user.profile.firstName} {user.profile.lastName}
                </b>{" "}
                updated the account <b>{account && account.acctNum}</b> and
                added the value <b>{fieldUpdatedValue}</b> in the field{" "}
                <b>{accountField}</b>.
              </div>
            )}
          </div>
        );
      default:
        return "";
    }
  };

  manageFilterBar = () => {
    const { filter } = this.state;
    this.setState({
      filter: !filter
    });
  };

  onSubmit = params => {
    const { model } = this.state;
    if ("type" in params) {
      FlowRouter.setQueryParams({ type: params.type });
      model.type = params.type;
    }
    this.setState({ model });
  };

  render() {
    const {
      accountActions,
      filter,
      model,
      actionTypes,
      isScrollLoading
    } = this.state;

    return (
      <div className="cc-container settings-container">
        <div ref="isScroll" style={{ width: "200%", overflowY: "scroll" }}>
          <div className="header__block">
            <div className="actions_filter__bar">
              <div
                className={filter ? "filter-block active" : "filter-block"}
                onClick={this.manageFilterBar}
              >
                <button>
                  <i className="icon-filter" />
                </button>
              </div>
            </div>
          </div>
          {filter && (
            <AutoForm
              autosave
              autosaveDelay={500}
              ref="filters"
              onSubmit={this.onSubmit}
              schema={schema}
              model={model}
            >
              <div className="filter-bar">
                <div className="select-wrapper">
                  <div className="flex--helper form-group__pseudo">
                    <div className="select-form">
                      <SelectField
                        labelHidden={true}
                        name="type"
                        options={actionTypes}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AutoForm>
          )}

          <Timeline>
            {accountActions &&
              accountActions.map((actionPerformed, index) => {
                const { createdAt, type } = actionPerformed;
                return (
                  <TimelineEvent
                    key={index}
                    title=""
                    createdAt={moment(createdAt).format(
                      "MMMM Do YYYY, hh:mm a"
                    )}
                    icon={this.getTimelineIcon(type)}
                  >
                    {this.getTimelineBody(actionPerformed)}
                  </TimelineEvent>
                );
              })}
          </Timeline>
        </div>
        {isScrollLoading && <Loading />}
      </div>
    );
  }
}

const schema = new SimpleSchema({
  type: {
    type: String,
    optional: true,
    label: "Search by Action type"
  }
});
