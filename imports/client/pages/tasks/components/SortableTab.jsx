import React from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {path} from '/imports/api/s3-uploads/utils';

const SortableItem = SortableElement(({value}) =>
    <li>{value}</li>
);

const SortableList = SortableContainer(({items}) => {
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} index={index} value={value}/>
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

    getPdfName(pdf) {
        return pdf.name.slice(0, pdf.name.indexOf('.'))
    }

    componentWillMount() {
        const {attachments} = this.props;
        let items = [];
        attachments && attachments.map((pdf, index) => {
            items.push(
                <a key={index} target="_blank"
                   href={path(pdf.path)}>
                    {this.getPdfName(pdf)}
                </a>
            )
        });

        this.setState({items});
    }

    render() {
        return (
            <div>
                <SortableList items={this.state.items} onSortEnd={this.onSortEnd.bind(this)}/>
            </div>
        )
    }
}