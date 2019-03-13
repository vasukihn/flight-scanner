import React, {Component} from 'react';
import './style.css';

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        {this.props.footerText}
      </div>
    )
  }
}

export default Footer;
