import React from "react";
import AccountMetaData from "/imports/client/pages/tasks/components/TaskContent/AccountMetaData";

export default class MetaDataSlider extends React.Component {
  constructor() {
    super();
    this.state = {
      fade: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 300);
  }

  closeSlider = () => {
    const { closeMetaData } = this.props;
    this.setState({ fade: true });
    closeMetaData();
  };

  groupFields(fields) {
    const numInRow = 5;
    const numGroups = Math.ceil(fields.length / numInRow);
    let result = [];
    for (let i = 0; i < numGroups; i++) {
      const startIndex = i * numInRow;
      const finishIndex = Math.min((i + 1) * numInRow, fields.length);
      const groupOfFields = fields.slice(startIndex, finishIndex);
      result.push(groupOfFields);
    }
    return result;
  }

  render() {
    const { fade } = this.state;
    const { task } = this.props;
    const { metaData } = task;
    const metaDataGroups = this.groupFields(Object.keys(metaData));
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.closeSlider} className="btn-cancel">
              Back
            </button>
          </div>
        </div>
        {task && (
          <AccountMetaData
            close={this.closeSlider}
            metaData={task.metaData}
            metaDataGroups={metaDataGroups}
          />
        )}
      </div>
    );
  }
}
