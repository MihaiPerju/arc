import React from 'react';
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';

import UserRoles from '/imports/api/users/enums/roles';

import SettingSingle from "./SettingSingle";
import MailSettingContent from "./MailSettingContent";


export default class Settings extends React.Component {
  constructor () {
    super ();
    this.state = {
      openRightPanel: null
    };
  }

  closePanel = () => {
    const { openRightPanel } = this.state;
    this.setState({ openRightPanel: null });
  }

  setPage = page => {
    const { openRightPanel } = this.state;
    if (openRightPanel === page) {
      this.setState({ openRightPanel: null });
    } else {
      this.setState({ openRightPanel: page });
    }
  };



  render () {
    const { openRightPanel } = this.state;
    return (

      <div className="cc-container">
      <div className={
        openRightPanel
          ? "left__side"
          : "left__side full__width"
      }
      >   
      <div className="search-bar">
        <div className="title"> Admin Settings</div>
      </div>
        <div className="task-list full-height" > 
          <SettingSingle 
            page="rootFolder" 
            title="Directory Settings" 
            setPage={this.setPage} 
            icon="icon-inbox" />
          <SettingSingle 
            page="mailSetting" 
            title="Mail Setting" 
            setPage={this.setPage} 
            icon="icon-envelope" />
      </div>  
      </div>

      {openRightPanel && (
        <RightSide
          page={openRightPanel}
          closePanel={this.closePanel}
        />
      )}

    </div>
    );
  }
}

class RightSide extends React.Component {
  constructor() {
    super();
    this.state = {
      fade: false,
      isDisabled: false,
      model: {},
    };
  }


  componentWillMount() {
    Meteor.call('admin.getRootFolder', (err, model) => {
      if (!err) {
        this.setState({ model });
      } else {
        Notifier.error(err.reason);
      }
    });

  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 300);
  }

  closePanel = () => {
    const { closePanel } = this.props;
    closePanel();
  };

  onSubmit (data) {
    Meteor.call ('admin.updateRootFolder', data, err => {
      if (!err) {
        Notifier.success ('Settings updated!');
      } else {
        Notifier.error (err.reason);
      }
    });
  }

  submitDirectorySetting = () => {
    const { rootFolderForm } = this.refs;
    rootFolderForm.submit();
  }

  render() {
    const { page } = this.props;
    const { model, fade, isDisabled } = this.state;

    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {page == 'mailSetting' && 
          <MailSettingContent 
          isDisabled={isDisabled}
          closePanel={this.closePanel}
          />
        }
        {page == 'rootFolder' &&
             <div className="create-form">
             <div className="create-form__bar">
               <div className="btn-group">
                 <button onClick={this.closePanel} className="btn-cancel">
                   Cancel
                 </button>
                 <button
                   style={isDisabled ? { cursor: "not-allowed" } : {}}
                   disabled={isDisabled}
                   onClick={this.submitDirectorySetting}
                   className="btn--green"
                 >
                   {isDisabled ? <div> Loading<i className="icon-cog" /></div> : "Confirm & Save"}
                 </button>
               </div>
             </div>
              <div className="create-form__wrapper">
                <div className="action-block">
                <AutoForm className="settings-form" model={model} onSubmit={this.onSubmit} schema={schema} ref="rootFolderForm" >
                <div className="header__block">
                  <div className="title-block text-uppercase">Root Directory Path</div>
                </div>
                
                <div className="form-wrapper">
                  <AutoField
                    labelHidden={true}
                    name="rootFolder"
                    placeholder="Type Root Directory"
                  />
                  <ErrorField name="rootFolder" />
                  </div>

                <div className="header__block m-t--20">
                  <div className="title-block text-uppercase">Letter Directory Path</div>
                </div>

                  <div className="form-wrapper">
                  <AutoField
                  labelHidden={true}
                    name="letterFolderPath"
                    placeholder="Type Letter Directory"
                  />
                  <ErrorField name="letterFolderPath" />
                  </div>
                </AutoForm>
                </div>
              </div>
          </div>
          }
      </div>
    );
  }
}

const schema = new SimpleSchema ({
  rootFolder: {
    type: String,
    optional: true,
  },
  letterFolderPath: {
    type: String,
    optional: true,
  }
});
