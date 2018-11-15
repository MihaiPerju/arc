import React from 'react';

export default class SearchInput extends React.PureComponent {
    
    render() {
        return (
            <div className='search-bar'>
                <div className='select-type'>
                </div>
                <div className="search-bar__wrapper flex--helper">
                    <div className='search-input full__width sort__width tag-btn'>
                        <div className="form-group">
                            <input />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}