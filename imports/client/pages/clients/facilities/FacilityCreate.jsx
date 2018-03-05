import React, {Component} from 'react';

export default class FacilityCreate extends Component {
    constructor() {
        super();
        this.state = {
            newContact: false
        }
    }

    newContact = () => {
        this.setState({
            newContact: true
        })
    }

    closeNewCotact = () => {
        this.setState({
            newContact: false
        })
    }

    render() {
        const { newContact } = this.state;

        return (
            <div className="create-form">
                <form action="">
                    <div className="create-form__bar">
                        <button className="btn-add">+ Add facility</button>
                        <div className="btn-group">
                            <button className="btn-cancel">Cancel</button>
                            <button className="btn--green">Confirm & save</button>
                        </div>
                    </div>
                    <div className="create-form__wrapper">
                        <div className="action-block i--block">
                            <div className="form-wrapper">
                                <input type="text" placeholder="Name"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Satus"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="First adress"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Second adress"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="City"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="State"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Sftp state"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Zip code"/>
                            </div>
                            <div className="select-group">
                                <div className="form-wrapper">
                                    <select name="filter">
                                        <option value="">Region</option>
                                    </select>
                                </div>
                            </div>
                            <div className="select-group">
                                <div className="form-wrapper">
                                    <select name="filter">
                                        <option value="">Allowed users</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {
                            newContact && <NewContact close={this.closeNewCotact}/>
                        }
                        <div className="add-filter text-center" onClick={this.newContact}>+ Add contact</div>
                    </div>
                </form>
            </div>
        );
    }
}

class NewContact extends Component {
    render() {
        const { close } = this.props;

        return (
            <div className="action-block action-new-contact">
                <div className="header__block">
                    <div className="title-block text-uppercase">Contact information</div>
                </div>
                <div className="row__action">
                    <div className="type">Contact nr. 1</div>
                    <div className="btn-delete" onClick={close}>Delete</div>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Client name"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="First name"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Phone number"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Email"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Phone number"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Email"/>
                </div>
                <div className="select-group">
                    <div className="form-wrapper">
                        <select name="filter">
                            <option value="">Contact Description</option>
                        </select>
                    </div>
                </div>
                <div className="form-wrapper">
                    <textarea placeholder="*Note"></textarea>
                </div>
            </div>
        )
    }
}