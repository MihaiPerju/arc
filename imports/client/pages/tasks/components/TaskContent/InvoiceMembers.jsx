import React, {Component} from 'react';

export default class InvoiceMembers extends Component {
    render() {
        const invoices = [
            {num: 4521555332},
            {num: 4521555332},
            {num: 4521555332},
            {num: 4521555332}
        ];

        return (
            <div className="invoice-section">
                <div className="left--side">
                    <div className="text-light-grey">Invoice numbers</div>
                </div>
                <div className="right--side">
                    <ul className="invoice-list">
                        {
                            invoices.map(function (invoice, index) {
                                return (
                                    <li key={index}>{invoice.num}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}