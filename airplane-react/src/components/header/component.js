import React, {Component} from 'react';
import './style.css';

class Header extends Component {
  render() {
    return (
      <div className="header">
        {this.props.headerText}
      </div>
    )
  }
}

export default Header;
