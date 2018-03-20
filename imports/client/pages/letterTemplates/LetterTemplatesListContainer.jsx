import React, {Component} from 'react';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import LetterTemplatesList from './components/LetterTemplatesList.jsx';
import LetterTemplateContent from './LetterTemplateContent.jsx';
import LetterTemplateCreate from './LetterTemplateCreate.jsx';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/letterTemplates/queries/listLetterTemplates";
import Loading from '/imports/client/lib/ui/Loading';
import {objectFromArray} from "/imports/api/utils";
import Notifier from '/imports/client/lib/Notifier';

class LetterTemplateListContainer extends Component {
    constructor() {
        super();
        this.state = {
            templatesSelected: [],
            currentTemplate: null,
            filter: false,
            create: false
        }
    }

    setTemplate = (_id) => {
        const {currentTemplate} = this.state;

        if (currentTemplate === _id) {
            this.setState({currentTemplate: null});
        } else {
            this.setState({currentTemplate: _id});
        }
    };

    selectTemplate = (_id) => {
        const {templatesSelected} = this.state;
        if (templatesSelected.includes(_id)) {
            templatesSelected.splice(templatesSelected.indexOf(_id), 1);
        } else {
            templatesSelected.push(_id);
        }
        this.setState({templatesSelected});
    };

    createForm = () => {
        this.setState({
            create: true,
            rightSide: true,
            currentTemplate: false
        })
    }

    closeForm = () => {
        this.setState({
            create: false
        })
    }

    deleteAction = () => {
        const {templatesSelected} = this.state;

        Meteor.call('letterTemplate.deleteMany', templatesSelected, (err) => {
            if (!err) {
                Notifier.success('Letter templates deleted !');
                this.setState({
                    currentTemplate: null,
                    templatesSelected: []
                })
            }
        });
    };

    render() {
        const {data, loading, error} = this.props;
        const {templatesSelected, currentTemplate, create} = this.state;
        const template = objectFromArray(data, currentTemplate);
        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className="cc-container">
                <div className={(currentTemplate || create) ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={templatesSelected.length} deleteAction={this.deleteAction}/>
                    <LetterTemplatesList
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        templatesSelected={templatesSelected}
                        selectTemplate={this.selectTemplate}
                        currentTemplate={currentTemplate}
                        setTemplate={this.setTemplate}
                        templates={data}
                    />
                    <PaginationBar create={this.createForm}/>
                </div>
                {
                    (currentTemplate || create) &&
                    <RightSide
                        template={template}
                        create={create}
                        close={this.closeForm}
                    />
                }
            </div>
        );
    }
}

class RightSide extends Component {
    constructor() {
        super();
        this.state = {
            fade: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({fade: true});
        }, 300);
    }

    render() {
        const {fade} = this.state;
        const {template, create, close} = this.props;
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                {
                    create ? <LetterTemplateCreate close={close}/> : <LetterTemplateContent template={template}/>
                }
            </div>
        )
    }
}

export default withQuery((props) => {
    return query.clone();
}, {reactive: true})(LetterTemplateListContainer)
