import React, { Component } from "react";
import LetterTemplateHeader from "./components/LetterTemplateContent/LetterTemplateHeader";
import LetterBody from "./components/LetterTemplateContent/LetterBody";
import DescriptionBlock from "./components/LetterTemplateContent/DescriptionBlock";
import LetterTemplateEdit from "./LetterTemplateEdit.jsx";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class LetterTemplateContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.pollingMethod = setInterval(() => {
      this.getTemplate();
    }, 3000);
  }

  getTemplate() {
    const { currentTemplate } = this.props;
    Meteor.call("template.getOne", currentTemplate, (err, template) => {
      if (!err) {
        this.setState({ template });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentWillUnmount = () => {
    //Removing Interval
    clearInterval(this.pollingMethod);
  };

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  render() {
    const { edit, template } = this.state;

    if (!template) {
      return <Loading />;
    }

    return (
      <div>
        {edit ? (
          <LetterTemplateEdit model={template} close={this.setEdit} />
        ) : (
          <div className="main-content letter-temp-content">
            <LetterTemplateHeader onEdit={this.setEdit} template={template} />
            <DescriptionBlock template={template} />
            <LetterBody template={template} />
          </div>
        )}
      </div>
    );
  }
}
