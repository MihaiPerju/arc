import React, {Component} from 'react';
import NewLetter from './NewLetter';
import LetterListQuery from '/imports/api/letters/queries/letterList.js';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import Loading from '/imports/client/lib/ui/Loading';

class LetterList extends Component {
    constructor() {
        super();
        this.state = {
            createLetter: false
        };
        this.newLetter = this.newLetter.bind(this);
    }

    newLetter() {
        this.setState({
            createLetter: !this.state.createLetter
        })
    }

    render() {
        const {data, isLoading, error,} = this.props;
        if (isLoading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Letter list</div>
                </div>
                <div className="main__block">
                    <div className="add-content" onClick={this.newLetter}>
                        <i className="icon-envelope-o"/>
                        <div className="text-center">+ Create a new letter</div>
                    </div>
                    {this.state.createLetter ? <NewLetter/> : null}
                    <div className="block-list letter-list">
                        <div className="block-item">
                            <div className="info">
                                <div className="title">Contact client with offers</div>
                                <div className="status pending">Pending</div>
                            </div>
                            <div className="btn-group">
                                <button className="btn-text--blue"><i className="icon-download"/></button>
                                <button className="btn-text--red"><i className="icon-trash-o"/></button>
                                <button className="btn--blue">View</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withQuery(() => {
    return LetterListQuery.clone();
})(LetterList)