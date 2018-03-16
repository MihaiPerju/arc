import React, {Component} from 'react';
import CodeSingle from './CodeSingle';

export default class CodeList extends Component {
    render() {
        const {codes} = this.props;
        const codeList = codes.map(function (code, index) {
            const {setCode, selectCode, codesSelected, currentCode} = this.props;
            return (
                <CodeSingle
                    codesSelected={codesSelected}
                    currentCode={currentCode}
                    selectCode={selectCode}
                    setCode={setCode}
                    code={code}
                    key={index}

                />
            )
        }, this)
        return (
            <div className={this.props.class}>
                {codeList}
            </div>
        );
    }
}
