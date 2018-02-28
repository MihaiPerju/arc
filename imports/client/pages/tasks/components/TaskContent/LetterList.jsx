import React, { Component } from 'react';
import NewLetter from './NewLetter';
import LetterListQuery from '/imports/api/letters/queries/letterList.js';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import Loading from '/imports/client/lib/ui/Loading';
import { getToken } from '/imports/api/s3-uploads/utils';

class LetterList extends Component {
    constructor () {
        super();
        this.state = {
            createLetter: false
        };
    }

    toggleLetter () {
        const {refetch} = this.props;
        this.setState({
            createLetter: !this.state.createLetter
        });
        refetch();
    }

    handleDelete = (letterId) => {
        Meteor.call('letter.delete', letterId, (err) => {
            if (err) {
                return Notifier.error('Error while removing letter!');
            }

            Notifier.success('Letter deleted!');
        });
    };

    redirectToPdf (pdf) {
        window.open('/letters/pdf/' + pdf, '_blank');
    }

    render () {
        const {data, isLoading, error, task} = this.props;
        if (isLoading) {
            return <Loading/>;
        }

        if (error) {
            return <div>Error: {error.reason}</div>;
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
                    {this.state.createLetter ? <NewLetter cancel={this.toggleLetter.bind(this)} task={task}/> : null}
                    <div className="block-list letter-list">
                        {
                            data &&
                            _.map(data, (letter, index) => {
                                return (
                                    <div key={index} className="block-item">
                                        <div className="info">
                                            <div className="title">There is no name for letters implemented!</div>
                                            <div className="status pending">{letter.status}</div>
                                        </div>
                                        <div className="btn-group">
                                            <button
                                                className="btn-text--blue"
                                                onClick={this.redirectToPdf.bind(this, `${task._id}/${letter._id}/${getToken()}`)}
                                            >
                                                <i className="icon-download"/></button>
                                            <button className="btn-text--red" onClick={() => (this.handleDelete(
                                                letter._id))}><i className="icon-trash-o"/></button>
                                            <button className="btn--blue" onClick={() => (
                                                FlowRouter.go('letter.view',
                                                    {taskId: task._id, letterId: letter._id})
                                            )}>
                                                View
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default withQuery((props) => {
    const {task} = props;
    return LetterListQuery.clone({taskId: task._id});
}, {reactive: true})(LetterList);