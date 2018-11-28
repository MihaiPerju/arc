import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import Dialog from "/imports/client/lib/ui/Dialog";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import Notifier from "/imports/client/lib/Notifier";
import { AutoForm, ErrorField } from "/imports/ui/forms";

export default class TagItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogIsActive: false,
      passedValue: '',
      tags: props.tags,
      tagIds: props.tagIds,
      
    };
  }
  componentWillReceiveProps(props){
    const {tags, tagIds} = props;
    if(this.state.tags !== tags){
      this.setState(()=>({tags: tags}))
    }
    if(this.state.tagIds !== tagIds){
      this.setState(()=>({tagIds: tagIds}))
    }
    
  }

  onhandleTag = e => {
    e.stopPropagation();
    this.setState({ dialogIsActive: true });
  };

  getOptions = tags => {
    return _.map(tags, tag => ({
      value: tag._id,
      label: tag.name
    }));
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  onSubmit = data => {
    const { onSubmitTags } = this.props;
    onSubmitTags(data);
    this.closeDialog();
  };

  confirmTags = () => {
    const { form } = this.refs;
    form.submit();
  };

  handleCreateTagButton = () => {
    const entities=[this.props.entityName];
    const {tags, passedValue} = this.state;
    let data={entities,name: passedValue}
    Meteor.call("tag.create", { data}, (err,result) => {
      if (!err) {
        data._id=result
        tags.push(data)
        Notifier.success("Tag added!");
        this.setState(()=>({tags}))
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  updateValue = data => {
    this.setState(() => ({
      passedValue: data
    }))
  }

  renderTag(option) {
    return (
      <div className="tag-item-with-bg">
        {option.label}
      </div>
    );
  }

    
    
    
  

  render() {
    const { tagIds, tags, dialogIsActive,passedValue } = this.state;
    const { title } = this.props;

    const noResultText =  <a className="create-tag-button" href='javascript:void(0);' onClick={this.handleCreateTagButton}>Create tag</a>

    const options = this.getOptions(tags);
    let selectedOptions = options.filter(p => tagIds.includes(p.value));


    return (
      <div>
        <div className="left__side tag-item-component">
          <div className="checkbox-wrap">
            <a onClick={this.onhandleTag.bind(this)}>
              <div className="menu__icon"><i className="icon-tags tags-icon"></i></div>
            </a>
          </div>
          <div className="tags-wrap">
            {
              selectedOptions.length > 0 ?
                selectedOptions.map(option => this.renderTag(option)) :
                <label className="no-tags-found">No tags found.</label>
            }
          </div>
        </div>
        {dialogIsActive && (
          <Dialog
            title={title}
            className="account-dialog"
            closePortal={this.closeDialog}
          >
            <AutoForm
              schema={schema}
              ref="form"
              onSubmit={this.onSubmit.bind(this)}
              model={{ tagIds }}
            >
              <div className="select-group">
                <div className="form-wrapper">
                  <SelectMulti
                    className="form-select__multi"
                    placeholder="Select tags"
                    labelHidden={true}
                    name="tagIds"
                    options={options}
                    noResultText={ ((passedValue.length > 1) &&(passedValue.trim().length>0)) ? noResultText : null}
                    updateValue={this.updateValue}
                  />
                  <ErrorField name="tagIds" />
                </div>
              </div>
            </AutoForm>
           
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button onClick={this.confirmTags} className="btn--light-blue">
                Confirm & Tag
              </button>
            </div>
          </Dialog>
        )}
      </div>
    );
  }
}

const schema = new SimpleSchema({
  tagIds: {
    type: Array,
    defaultValue: []
  },
  "tagIds.$": {
    type: String
  }
});
