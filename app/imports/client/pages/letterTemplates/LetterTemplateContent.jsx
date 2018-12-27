import React, { Component } from "react";
import LetterTemplateHeader from "./components/LetterTemplateContent/LetterTemplateHeader";
import LetterBody from "./components/LetterTemplateContent/LetterBody";
import DescriptionBlock from "./components/LetterTemplateContent/DescriptionBlock";
import LetterTemplateEdit from "./LetterTemplateEdit.jsx";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class LetterTemplateContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      templateID: this.props.currentTemplate,
      template: null
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.getTemplate();
    this.pollingMethod = setInterval(() => {
      this.getTemplate();
    }, 3000);
  }

  getTemplate(passedID) {
    const currentTemplate = passedID ? passedID : this.state.templateID;
    Meteor.call("template.getOne", currentTemplate, (err, template) => {
      if (!err) {
        this.setState({ template });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

    // If template changed we need to go fetch it right away
    componentWillReceiveProps(nextProps) {
      if(nextProps.currentTemplate === this.state.templateID)
        return;
    
      this.setState({
        edit: false, 
        template: null, 
        templateID: nextProps.currentTemplate,
      });
  
      this.getTemplate(nextProps.currentTemplate);
    }

  componentWillUnmount = () => {
    //Removing Interval
    clearInterval(this.pollingMethod);
  };

  setEdit = () => {
    this.setState({ edit: !this.state.edit });
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
