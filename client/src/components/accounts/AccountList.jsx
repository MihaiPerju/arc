import React from 'react';
import TopBar from '../SearchBar';

export default class AccountList extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            accountsSelected: [],
            currentAccount: null,
            page: 1,
            perPage: 13,
            total: 0,
            showMetaData: false,
            openPane: false,
            searchInput: ''
        };
    }
    
    componentWillMount() {
        // TODO: Fetch users accounts
    }
    
    componentWillReceiveProps(newProps) {
        // TODO: Clear filtering if remounted
    }
    
    componentWillUnmount() {
        // TODO: Remove any open locks
        // this.removeLock();
    }
    
    // selectAccount = newAccount => {
    //     const { currentAccount } = this.state;
    //     this.removeLock();
    //     // removing accountId from the query when navigating from notification
    //     FlowRouter.setQueryParams({ accountId: null });
    //     if (this.checkAccountIsLocked(newAccount)) {
    //         if (currentAccount === newAccount._id) {
    //             this.closeRightPanel();
    //         } else {
    //             this.setState({
    //                 currentAccount: newAccount._id,
    //                 showMetaData: false
    //             });
    //             const { state } = FlowRouter.current().params;
    //             if (state === "active") {
    //                 this.incrementViewCount(newAccount._id);
    //             }
    //             this.addLock(newAccount._id);
    //         }
    //     }
    // };
    
    incrementViewCount = _id => {
        // TODO: Track the user viewed the acct
    };
    
    checkAllAccount = selectAll => {
        // TODO: Allow a user to select all accounts matching filters
    };
    
    changeFilters(filters) {
        this.updateFilters({ filters });
    }
    
    toggleBulkAction = () => {
        console.log('Opened Bulk Action Modal')
        // TODO: Open Bulk Action Modal
    };

    toggleFilters = () => {
        console.log('Opened Filters Modal')
        // TODO: Open Filters Modal
    }

    toggleSort = () => {
        console.log('Opened Sort Pane')
        // TODO: Open Sort Pane
    }
    
    nextPage = inc => {
        // TODO: Fetch next page
    };
    
    openMetaDataSlider = () => {
        this.setState({showMetaData: true});
    };
    
    closeMetaDataSlider = () => {
        this.setState({showMetaData: false});
    };
    
    closeRightPanel = () => {
        this.setState({ currentAccount: null, showMetaData: false });
    };
    
    addLock = _id => {
        // TODO: Lock an account
    };

    searchAccountNumber = (event) => {
        this.setState({searchInput: event.target.value})
    }
    
    removeLock = () => {
        // TODO: Unlock and account
    };
    
    render() {
        if (this.props.isLoading) {
            // return <Loading />;
        }
        
        // The icons to add to the search bar
        const icons = {
            leftIcons: [
                { className: 'icon-uncheck-box', method: this.selectAll },
                { className: 'icon-thumb-tack', method: this.toggleBulkAction }
            ],
            rightIcons: [
                { className: 'icon-filter', method: this.toggleFilters},
                { className: 'icon-sort-alpha-asc', method: this.toggleSort},
            ]
        };
        
        
        return (
            <div className="cc-container">
                <div className={`left__side ${this.state.openPane ? '' : 'full__width'}`}>
                    <TopBar 
                        placeHolder={'Search Account Number'} 
                        currentValue={this.state.searchInput}
                        onChange={this.searchAccountNumber}
                        leftIcons={icons.leftIcons}
                        rightIcons={icons.rightIcons}
                    />
                </div>
            </div>
        )
    }
}