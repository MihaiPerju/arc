import React, {Component} from 'react';
import Dialog from '/imports/client/lib/ui/Dialog';

export default class SubstateDescription extends Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: false
    }
  }

  openDialog = () => {
    this.setState({
      dialogIsActive: true
    });
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    })
  };

  render() {
    const {dialogIsActive} = this.state;
    const {children} = this.props;

    return (
      <div className="note-view">
        <button className="cc-button" onClick={this.openDialog}>
          <i className="icon-view"/>
          {
            dialogIsActive &&
            <Dialog className="note-view__dialog" closePortal={this.closeDialog} title="Notes">
              <button className="cc-btn__close" onClick={this.closeDialog}>
                <i className="icon-close"/>
              </button>
              {children}
            </Dialog>
          }
        </button>
      </div>
    )
  }
}