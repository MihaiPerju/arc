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
      moduleTags: props.moduleTags,
      tagIds: props.tagIds,
      
    };
  }
  componentWillReceiveProps(props){
    const {moduleTags, tagIds} = props;
    if(this.state.moduleTags !== moduleTags){
      this.setState(()=>({moduleTags: moduleTags}))
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
    const {moduleTags, tagIds, passedValue} = this.state;
    let data={entities,name: passedValue}
    Meteor.call("tag.create", { data}, (err,result) => {
      if (!err) {
        data._id=result
        moduleTags.push(data)
        Notifier.success("Tag added!");
        this.setState(()=>({moduleTags}))
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

  render() {
    const { title } = this.props;
    const { tagIds, moduleTags, dialogIsActive } = this.state;
    const options = this.getOptions(moduleTags);
    const noResultText =  <a className="create-tag-button" href='javascript:void(0);' onClick={this.handleCreateTagButton}>Create tag</a>
    return (
      <div>
        <a onClick={this.onhandleTag.bind(this)}>
          <img
            style={{ width: "16px", margin: "2px 7px" }}
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiBoZWlnaHQ9IjMycHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJ0YWciPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMxLjM5MSwxMy44ODNsLTUtOGMtMC43My0xLjE2OS0yLjAxMi0xLjg4LTMuMzkxLTEuODhINCAgIGMtMi4yMDksMC00LDEuNzkxLTQsNHYxNmMwLDIuMjA5LDEuNzkxLDQsNCw0aDE5YzEuMzc5LDAsMi42Ni0wLjcxMSwzLjM5MS0xLjg4MWw1LThDMzIuMjAzLDE2LjgyNywzMi4yMDMsMTUuMTgsMzEuMzkxLDEzLjg4M3ogICAgTTI5LjY5NSwxNy4wNjJsLTUsOC4wMDJjLTAuMzY3LDAuNTg4LTEuMDAyLDAuOTM5LTEuNjk1LDAuOTM5SDRjLTEuMTAzLDAtMi0wLjg5OC0yLTJ2LTE2YzAtMS4xMDMsMC44OTctMiwyLTJoMTkgICBjMC42OTMsMCwxLjMyOCwwLjM1MiwxLjY5NSwwLjkzOWw1LDhDMzAuMDk4LDE1LjU4NywzMC4wOTgsMTYuNDE5LDI5LjY5NSwxNy4wNjJ6IiBmaWxsPSIjMzMzMzMzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMywxMy4wMDNjLTEuNjU4LDAtMywxLjM0My0zLDNjMCwxLjY1NywxLjM0MiwzLDMsMyAgIGMxLjY1NiwwLDMtMS4zNDQsMy0zQzI2LDE0LjM0NiwyNC42NTYsMTMuMDAzLDIzLDEzLjAwM3ogTTIzLDE4LjAwNGMtMS4xMDUsMC0yLTAuODk2LTItMmMwLTEuMTA0LDAuODk1LTIsMi0yICAgYzEuMTA0LDAsMiwwLjg5NiwyLDJDMjUsMTcuMTA3LDI0LjEwNCwxOC4wMDQsMjMsMTguMDA0eiIgZmlsbD0iIzMzMzMzMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9nPjwvc3ZnPg=="
            alt=""
          />
        </a>
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
                    noResultText={noResultText}
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
