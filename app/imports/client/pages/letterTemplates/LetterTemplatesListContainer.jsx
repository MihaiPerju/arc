import React from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import LetterSearchBar from "./components/LetterSearchBar.jsx";
import LetterTemplatesList from "./components/LetterTemplatesList.jsx";
import Notifier from "/imports/client/lib/Notifier";
import ParamsService from "../../lib/ParamsService";
import Pager from "../../lib/Pager";
import TagsListQuery from "/imports/api/tags/queries/listTags";
import { moduleNames } from "/imports/api/tags/enums/tags";
import RightSide from "./TemplateRightSide";

export default class LetterTemplateListContainer extends Pager {
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
      tags: [],
      templates: []
    });

    this.method = "templates.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);
    this.getTags();

    this.pollingMethod = setInterval(() => {
      this.listTemplates();
    }, 3000);
  }

  listTemplates = () => {
    const params = ParamsService.getTemplatesParams();
    Meteor.call("templates.get", params, (err, templates) => {
      if (!err) {
        this.setState({ templates });
        this.updatePager();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
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
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentTemplate: null });

    this.listTemplates();
  };

  updatePager = () => {
    // update the pager count
    const queryParams = ParamsService.getTemplatesParams();
    this.recount(queryParams);
  };

  getTags = () => {
    TagsListQuery.clone({
      filters: { entities: { $in: [moduleNames.TEMPLATES] } }
    }).fetch((err, tags) => {
      if (!err) {
        this.setState({ tags });
      }
    });
  };

  render() {
    const {
      templatesSelected,
      currentTemplate,
      create,
      range,
      total,
      tags,
      templates
    } = this.state;

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
            tags={tags}
          />
          <LetterTemplatesList
            class={
              this.state.filter
                ? "task-list templates decreased"
                : "task-list templates"
            }
            templatesSelected={templatesSelected}
            selectTemplate={this.selectTemplate}
            currentTemplate={currentTemplate}
            setTemplate={this.setTemplate}
            templates={templates}
            tags={tags}
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
            currentTemplate={currentTemplate}
            create={create}
            close={this.closeForm}
          />
        )}
      </div>
    );
  }
}
