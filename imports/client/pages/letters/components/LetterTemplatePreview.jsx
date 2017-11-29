import React from "react";
import Parser from "simple-text-parser";

export default class LetterTemplatePreview extends React.Component {
    tagParser = () => {
        const {state} = this.props;
        const parser = new Parser();
        const {letterTemplateBody} = this.props;
        if(!letterTemplateBody) {
            return;
        }

        parser.addRule(/<code>(.*?)<\/code>/g, function(tag) {
            const word = tag.substring(6).slice(0, -7);
            return `${state[word] ? state[word]: `<code>${word}</code>`}`;
        });

        return parser.render(letterTemplateBody);
    };

    render() {
        const {letterTemplateBody} = this.props;

        return(
            <div>
                {!!letterTemplateBody && <div dangerouslySetInnerHTML={{__html: this.tagParser()}}></div>}
            </div>
        );
    }
}