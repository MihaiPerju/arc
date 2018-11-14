import React from 'react';

export default class SearchInput extends React.PureComponent {
    
    render() {
        return (
            <div className='search-input'>
                <div className="form-group">
                    <AutoField
                        labelHidden={true}
                        name="acctNum"
                        placeholder="Search by Account Number"
                    />
                </div>
            </div>
        )
    }
}