import React from 'react';

export default class AccountMetaData extends React.Component {
  render () {
    const {metadata} = this.props;
    return (
      <div className="metadata-container">
        <div className="main-content">
          <div className="header-block header-account">
            <div className="main-content__header header-block">
              <div className="row__header">
                <div className="row__wrapper">
                  <div className="title text-center">Meta Data</div>
                </div>
              </div>
            </div>
            <div className="additional-info">
              <ul>
                {metadata &&
                  Object.keys (metadata).map ((data, index) => {
                    return (
                      <li className="text-center" key={index}>
                        <div className="text-light-grey">{data}</div>
                        <div className="text-dark-grey text-uppercase">
                          {metadata[data]}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
