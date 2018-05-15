import React from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { getToken } from '/imports/api/s3-uploads/utils';
import { Segment, Button, Divider } from 'semantic-ui-react';
import Notifier from '/imports/client/lib/Notifier';
import AccountViewService from '../services/AccountViewService';

const SortableItem = SortableElement(({pdf, index, getPdfName, deletePdf, redirectToPdf}) =>
    <li style={{'listStyleType': 'none'}}>
        {
            pdf &&
            <div className="block-item">
                <div className="info">
                    <div className="title">{getPdfName(pdf)}</div>
                </div>
                <div className="btn-group">
                    <button onClick={redirectToPdf.bind(this, pdf)} className="btn-text--blue">
                        <i className="icon-download"/>
                    </button>
                    <button onClick={deletePdf.bind(this, pdf)} className="btn-text--red">
                        <i className="icon-trash-o"/>
                    </button>
                </div>
            </div>
        }
    </li>
);

const SortableList = SortableContainer(({items, getPdfName, deletePdf, redirectToPdf}) => {
    return (
        <ul>
            {items.map((pdf, index) => (
                <SortableItem redirectToPdf={redirectToPdf}
                              getPdfName={getPdfName}
                              deletePdf={deletePdf}
                              key={`item-${index}`}
                              index={index}
                              pdf={pdf}/>
            ))}
        </ul>
    );
});

export default class SortableTab extends React.Component {
    constructor () {
        super();
        this.state = {
            items: [],
        };
    }

    onSortEnd ({oldIndex, newIndex}) {
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex),
        });
    };

    getPdfName (pdf) {
        return pdf.name.slice(0, pdf.name.indexOf('.'));
    }

    redirectToPdf (pdf) {
        window.open('/pdf/' + pdf._id + '/' + getToken(), '_blank');
    }

    deletePdf (pdf) {
        const accountId = FlowRouter.current().params._id;

        Meteor.call('account.attachment.remove', accountId, pdf._id, pdf.path, (err) => {
            if (!err) {
                Notifier.success('Attachment removed!');
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    componentWillMount () {
        const {attachments} = this.props;
        let items = [];
        attachments && attachments.map((pdf) => {
            items.push(
                pdf
            );
        });

        this.setState({items});
    }

    componentWillReceiveProps ({attachments}) {
        let items = [];
        attachments && attachments.map((pdf) => {
            items.push(
                pdf
            );
        });

        this.setState({items});
    }

    render () {
        const {items} = this.state;
        return (
            <div>
                <SortableList items={items}
                              deletePdf={this.deletePdf.bind(this)}
                              getPdfName={AccountViewService.getPdfName}
                              redirectToPdf={this.redirectToPdf}
                              onSortEnd={this.onSortEnd.bind(this)}/>
            </div>
        );
    }
}