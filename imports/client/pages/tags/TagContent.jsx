import React, {Component} from 'react';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import TagContentHeader from './components/TagContent/TagContentHeader';
import TagEdit from './TagEdit';
import TagContentDescription from './components/TagContent/TagContentDescription';
import queryUsers from '/imports/api/users/queries/listUsers';
import PagerService from "/imports/client/lib/PagerService";

class TagContent extends Component {
    constructor() {
        super();
        this.state = {
            edit: false
        }
    }

    componentWillReceiveProps(){
        this.setState({edit:false});
    }

    setEdit = () => {
        const {edit} = this.state;
        this.setState({edit: !edit})
    };

    render() {
        const {edit} = this.state;
        const {tag, clients, data, loading, error} = this.props;
        if (error) {
            return <div>Error: {error.reason}</div>;
        }

        return (
            <div className="main-content tag-content">
                {
                    edit ? <TagEdit setEdit={this.setEdit} clients={clients} tag={tag}/> :
                        <div>
                            <TagContentHeader setEdit={this.setEdit} tag={tag}/>
                            <TagContentDescription users={data} currentTag={tag} />
                        </div>
                }
            </div>
        )
    }
}

export default withQuery((props) => {
    const params = {
        filters: {roles: {$in: ['rep']}}
    }
    return queryUsers.clone(params);
}, {reactive: true})(TagContent);