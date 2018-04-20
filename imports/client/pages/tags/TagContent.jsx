import React, {Component} from 'react';
import TagContentHeader from './components/TagContent/TagContentHeader';
import TagEdit from './TagEdit';

export default class TagContent extends Component {
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
        const {tag, clients} = this.props;
        return (
            <div className="main-content tag-content">
                {
                    edit ? <TagEdit setEdit={this.setEdit} clients={clients} tag={tag}/> :
                        <div>
                            <TagContentHeader setEdit={this.setEdit} tag={tag}/>
                        </div>
                }
            </div>
        )
    }
}