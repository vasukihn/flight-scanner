import React, {Component} from 'react';
import './style.css';

class TitleBar extends Component {
  render() {
    return (
      <div className="title-bar">
        {this.props.titleText}
      </div>
    )
  }
}

export default TitleBar;
