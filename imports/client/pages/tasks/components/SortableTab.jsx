import React from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {path, getToken} from '/imports/api/s3-uploads/utils';
import {Segment, Button, Divider} from 'semantic-ui-react';
import Notifier from '/imports/client/lib/Notifier';

const SortableItem = SortableElement(({pdf, index, getPdfName, deletePdf, redirectToPdf}) =>
    <li style={{'listStyleType': 'none'}}>
        {
            pdf &&
            <Segment clearing>
                <Button.Group floated='right'>
                    <Button primary onClick={redirectToPdf.bind(this, pdf)}>
                        View
                    </Button>
                    <Button negative onClick={deletePdf.bind(this, pdf)}>
                        Delete
                    </Button>
                </Button.Group>
                {getPdfName(pdf)}
            </Segment>
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
    constructor() {
        super();
        this.state = {
            items: [],
        }
    }

    onSortEnd({oldIndex, newIndex}) {
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex),
        });
    };

    downloadPdfs() {
        const taskId = FlowRouter.current().params._id;
        const {items} = this.state;

        //creating attachmentIds
        let attachmentIds = [];

        for (item of items) {
            attachmentIds.push(item._id);
        }

        //Updating status in Db
        Meteor.call('task.attachment.update_order', taskId, attachmentIds, (err) => {
            if (!err) {
                Notifier.success('Reordered!');
                window.open("/pdfs/" + taskId + "/" + getToken(), '_blank');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    getPdfName(pdf) {
        return pdf.name.slice(0, pdf.name.indexOf('.'))
    }

    redirectToPdf(pdf) {
        window.open(path(pdf.path), '_blank');
    }

    deletePdf(pdf) {
        const taskId = FlowRouter.current().params._id;

        Meteor.call('task.attachment.remove', taskId, pdf._id, pdf.path, (err) => {
            if (!err) {
                Notifier.success("Attachment removed!");
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    componentWillMount() {
        const {attachments} = this.props;
        let items = [];
        attachments && attachments.map((pdf) => {
            items.push(
                pdf
            )
        });

        this.setState({items});
    }

    render() {
        return (
            <div>
                <SortableList items={this.state.items}
                              deletePdf={this.deletePdf}
                              getPdfName={this.getPdfName}
                              redirectToPdf={this.redirectToPdf}
                              onSortEnd={this.onSortEnd.bind(this)}/>
                <Divider/>
                {
                    <Button fluid onClick={this.downloadPdfs.bind(this)}
                            target="_blank">
                        Download All PDFs
                    </Button>
                }
            </div>
        )
    }
}