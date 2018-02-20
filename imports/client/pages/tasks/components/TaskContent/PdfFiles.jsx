import React, {Component} from 'react';
import DropzoneComponent from 'react-dropzone-component';
import {getToken} from "../../../../../api/s3-uploads/utils";
import Notifier from "../../../../lib/Notifier";
import SortableTab from './../SortableTab';

export default class ActionBlock extends Component {
    constructor() {
        super();

        this.state = {
            isUploading: false
        }
    }

    downloadPdfs() {
        const {task} = this.props;
        const {items} = this.child.state;

        //creating attachmentIds
        let attachmentIds = [];

        for (item of items) {
            attachmentIds.push(item._id);
        }

        //Updating status in Db
        Meteor.call('task.attachment.update_order', task._id, attachmentIds, (err) => {
            if (!err) {
                window.open("/pdfs/" + task._id + "/" + getToken(), '_blank');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        const {task} = this.props;

        const componentConfig = {
            postUrl: `/uploads/task-pdf/` + task._id + '/' + getToken()
        };
        const that = this;
        const djsConfig = {
            complete(file) {
                Notifier.success('Added');
                this.removeFile(file);
                that.getTask();
            },
            acceptedFiles: '.pdf'
        };

        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">pdf files</div>
                </div>
                <div className="main__block">
                    <div className="btn-group-1">
                        <div className="add-content">
                            <i className="icon-file-pdf-o"/>
                            <div style={{"margin-left": '20%'}} className="text-center">
                                <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
                            </div>
                        </div>
                        {
                            task.attachments && task.attachments.length > 1 &&
                            <button
                                onClick={this.downloadPdfs.bind(this)}
                                className="btn-download">
                                <span className="text-dark-grey">Download all</span>
                            </button>
                        }

                    </div>
                    <div className="block-list file-list">
                        {/*To be listed here*/}
                        <SortableTab ref={instance => {
                            this.child = instance;
                        }} attachments={task && task.attachments}/>
                    </div>
                </div>
            </div>
        )
    }
}