import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import LetterSearchBar from "./components/LetterSearchBar.jsx";
import LetterTemplatesList from "./components/LetterTemplatesList.jsx";
import LetterTemplateContent from "./LetterTemplateContent.jsx";
import LetterTemplateCreate from "./LetterTemplateCreate.jsx";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/letterTemplates/queries/listLetterTemplates";
import Loading from "/imports/client/lib/ui/Loading";
import { objectFromArray } from "/imports/api/utils";
import Notifier from "/imports/client/lib/Notifier";
import PagerService from "../../lib/PagerService";
import Pager from "../../lib/Pager";
import TagsListQuery from '/imports/api/tags/queries/listTags';
import { moduleNames } from "/imports/client/pages/moduleTags/enums/moduleList";

class LetterTemplateListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      templatesSelected: [],
      currentTemplate: null,
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      moduleTags: []
    });
    this.query = query;
  }

  componentWillMount() {
    this.nextPage(0);
    this.getModuleTags();
  }

  componentWillReceiveProps() {
    const { queryParams } = FlowRouter.current();
    if (
      queryParams.letterTemplateName &&
      queryParams.letterTemplateName == ""
    ) {
      this.setPagerInitial();
    }
    this.updatePager();
  }

  setPagerInitial = () => {
    this.setState(
      {
        page: 1,
        perPage: 13,
        total: 0
      },
      () => {
        this.nextPage(0);
      }
    );
  };

  setTemplate = _id => {
    const { currentTemplate } = this.state;

    if (currentTemplate === _id) {
      this.setState({ currentTemplate: null });
    } else {
      this.setState({ currentTemplate: _id });
    }
  };

  selectTemplate = _id => {
    const { templatesSelected } = this.state;
    if (templatesSelected.includes(_id)) {
      templatesSelected.splice(templatesSelected.indexOf(_id), 1);
    } else {
      templatesSelected.push(_id);
    }
    this.setState({ templatesSelected });
  };

  createForm = () => {
    this.setState({
      create: true,
      rightSide: true,
      currentTemplate: false
    });
  };

  closeForm = () => {
    this.setState({
      create: false
    });
    this.updatePager();
  };

  deleteAction = () => {
    const { templatesSelected } = this.state;

    Meteor.call("letterTemplate.deleteMany", templatesSelected, err => {
      if (!err) {
        Notifier.success("Letter templates deleted !");
        this.setState({
          currentTemplate: null,
          templatesSelected: []
        });
        this.closeForm();
      }
    });
  };

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentTemplate: null });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  getModuleTags = () => {
    TagsListQuery
      .clone({
        filters: { entities: { $in: [moduleNames.TEMPLATES] } }
      })
      .fetch((err, moduleTags) => {
        if (!err) {
          this.setState({ moduleTags });
        }
      });
  };

  render() {
    const { data, isLoading, error } = this.props;
    const {
      templatesSelected,
      currentTemplate,
      create,
      range,
      total,
      moduleTags
    } = this.state;
    const template = objectFromArray(data, currentTemplate);

    if (isLoading && !FlowRouter.getQueryParam("letterTemplateName")) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }

    return (
      <div className="cc-container">
        <div
          className={
            currentTemplate || create ? "left__side" : "left__side full__width"
          }
        >
          <LetterSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={templatesSelected.length}
            deleteAction={this.deleteAction}
            hideSort
            hideFilter
            moduleTags={moduleTags}
          />
          <LetterTemplatesList
            class={this.state.filter ? "task-list templates decreased" : "task-list templates"}
            templatesSelected={templatesSelected}
            selectTemplate={this.selectTemplate}
            currentTemplate={currentTemplate}
            setTemplate={this.setTemplate}
            templates={data}
            moduleTags={moduleTags}
          />
          <PaginationBar
            module="Template"
            create={this.createForm}
            closeForm={this.closeForm}
            nextPage={this.nextPage}
            range={range}
            total={total}
          />
        </div>
        {(currentTemplate || create) && (
          <RightSide
            template={template}
            create={create}
            close={this.closeForm}
          />
        )}
      </div>
    );
  }
}

class RightSide extends Component {
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

  render() {
    const { fade } = this.state;
    const { template, create, close } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <LetterTemplateCreate close={close} />
        ) : (
          <LetterTemplateContent template={template} />
        )}
      </div>
    );
  }
}

export default withQuery(
  props => {
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;
    return PagerService.setQuery(query, { page, perPage, filters: {} });
  },
  { reactive: true }
)(LetterTemplateListContainer);
