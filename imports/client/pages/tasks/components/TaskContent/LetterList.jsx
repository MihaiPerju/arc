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
    }

    toggleLetter() {
        const {refetch} = this.props;
        this.setState({
            createLetter: !this.state.createLetter
        });
        refetch();
    }

    render() {
        const {data, isLoading, error, task} = this.props;
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
                    <div className="add-content" onClick={this.toggleLetter.bind(this)}>
                        <i className="icon-envelope-o"/>
                        <div className="text-center">+ Create a new letter</div>
                    </div>
                    {this.state.createLetter ?
                        <NewLetter cancel={this.toggleLetter.bind(this)} task={task}/> : null}
                    <div className="block-list letter-list">
                        {
                            _.map(data, (letter, index) => {
                                return (
                                    <div key={index} className="block-item">
                                        <div className="info">
                                            <div className="title">There is no name for letters implemented!</div>
                                            <div className="status pending">{letter.status}</div>
                                        </div>
                                        <div className="btn-group">
                                            <button className="btn-text--blue"><i className="icon-download"/></button>
                                            <button className="btn-text--red"><i className="icon-trash-o"/></button>
                                            <button className="btn--blue">View</button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default withQuery((props) => {
    const {task} = props;
    return LetterListQuery.clone({taskId: task._id});
})(LetterList)