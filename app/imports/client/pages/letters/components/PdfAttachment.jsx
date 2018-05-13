import React, {Component} from "react";

export default class PdfAttachments extends Component {
    render() {
        const attachments = ['Attachment 1', 'Attachment 2', 'Attachment 3', 'Attachment 444444444'];

        return (
            <div className="attachment-list">
                {
                    attachments.map(function(attachment, index) {
                        return(
                            <PdfItem key={index}
                                     title={attachment}
                            />
                        )
                    })
                }
            </div>
        );
    }
}

class PdfItem extends Component {
    render() {
        const {title} = this.props;

        return (
            <div className="attachment-item">
                <span className="text-white truncate">{title}</span>
                <div className="btn-rmv">
                    <i className="icon-trash-o"/>
                </div>
            </div>
        );
    }
}
