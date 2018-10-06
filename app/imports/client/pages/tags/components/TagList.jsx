import React, {Component} from 'react';
import TagSingle from './TagSingle';

export default class TagList extends Component {
    render() {
        const {tags, moduleTags} = this.props;
        const tagList = tags.map(function (tag) {
            const {setTag, selectTag, tagsSelected, currentTag} = this.props;
            return (
                <TagSingle
                    tagsSelected={tagsSelected}
                    currentTag={currentTag}
                    selectTag={selectTag}
                    setTag={setTag}
                    tag={tag}
                    key={tag._id}
                    moduleTags={moduleTags}
                />
            )
        }, this)
        return (
            <div className={this.props.class}>
                {tagList}
            </div>
        );
    }
}
