import React, {Component} from 'react'
import TaskList from './components/TaskList.jsx';
import TaskBar from './components/TaskBar.jsx';
import PaginationBar from './components/PaginationBar.jsx';
import TaskContent from './TaskContent.jsx';
import FilterSearch from './components/FilterSearch.jsx';

export default class TaskListContainer extends Component {
    constructor() {
        super();
        this.state = {
            rightSide: false,
            btnGroup: false
        }
        this.renderRightSide = this.renderRightSide.bind(this);
        this.showBtnGroup = this.showBtnGroup.bind(this);
    }
    
    renderRightSide() {
        this.setState({
            rightSide: true
        })
    }

    showBtnGroup() {
        this.setState({
            btnGroup: !this.state.btnGroup
        })
    }

    render() {
        return (
            <div className="task-container">
                <div className={this.state.rightSide ? "left__side" : "left__side full__width"}>
                    <TaskBar btnGroup={this.state.btnGroup}/>
                    <FilterSearch/>
                    <TaskList renderContent={this.renderRightSide} showBtnGroup={this.showBtnGroup}/>
                    <PaginationBar/>
                </div>
                {
                    this.state.rightSide ? (
                        <div className="right__side">
                            <TaskContent/>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}