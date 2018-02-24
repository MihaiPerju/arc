import React, {Component} from 'react';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import FilterBar from '/imports/client/lib/FilterBar.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import FacilityList from './components/FacilityList.jsx';
import FacilityContent from './FacilityContent.jsx';

export default class FacilityContainer extends Component {
    constructor() {
        super();
        this.state = {
            filter: false,
            btnGroup: false,
            rightSide: false
        };
        this.renderRightSide = this.renderRightSide.bind(this);
        this.showFilterBar = this.showFilterBar.bind(this);
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

    showFilterBar() {
        this.setState({
            filter: !this.state.filter
        })
    }

    render() {
        const {rightSide, btnGroup, filter} = this.state;

        return (
            <div className="cc-container">
                <div className={rightSide ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={btnGroup} filter={this.showFilterBar}/>
                    {filter ? <FilterBar/> : null}
                    <FacilityList
                        class={filter ? "task-list decreased" : "task-list"}
                        renderContent={this.renderRightSide}
                        showBtnGroup={this.showBtnGroup}
                    />
                    <PaginationBar/>
                </div>
                {
                    rightSide ? (
                        <RightSide/>
                    ) : null
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
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                <FacilityContent/>
            </div>
        )
    }
}