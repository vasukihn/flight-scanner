import React, {Component} from 'react';
import {Card, Icon, notification} from 'antd';
import {isNil} from 'ramda';
import moment from 'moment';
import 'antd/dist/antd.css';
import './style.css';

import Header from '../../components/header/component';
import Footer from '../../components/footer/component';
import TitleBar from '../../components/title-bar/component';

class Purchase extends Component {
  state = {
    isLoading: false
  };

  componentDidMount() {
    const selectedFlight = this.props.history.location.state.selectedFlight;

    if (isNil(selectedFlight)) {
      this.props.history.replace('/');
    } else {
      this.setState({selectedFlight: selectedFlight});
    }
  }

  handlePurchase = () => {
    const selectedFlight = this.state.selectedFlight;
    const {origin, destination, price} = selectedFlight;

    notification.open({
      message: 'Flight Ticket Booked!',
      description: `From ${origin}
      To ${destination}
      for ${price} euros`,
      icon: <Icon type="smile"
                  style={{color: '#108ee9'}}/>,
    });
  };

  handleBackStep = () => this.props.history.replace('/');

  render() {
    const selectedFlight = this.props.history.location.state.selectedFlight;
    const {origin, destination, price, departure, arrival} = selectedFlight;

    return (
      <div className="container">
        <Header headerText="FlightScanner"/>
        <div className="middle">
          <TitleBar titleText="Booking summary"/>
          <div className="middle-card-container"
               style={{background: '#E2E6EC', padding: '30px'}}>
            <Card title="Chosen flight"
                  bordered={false}
                  style={{width: 300}}>
              <p>Origin: {origin}</p>
              <p>Destination: {destination}</p>
              <p>Price: €{price}</p>
              <p>Departure date: {moment(departure).format('MMMM Do YYYY, h:mm:ss a')}</p>
              <p>Arrival date: {moment(arrival).format('MMMM Do YYYY, h:mm:ss a')}</p>
            </Card>
          </div>
          <div className="middle-buttons">
            <button type="button"
                    disabled={isNil(this.state.selectedFlight)}
                    className="form-submit to-purchase-button"
                    onClick={this.handleBackStep.bind(this)}>
              Back
            </button>
            <button type="button"
                    disabled={isNil(this.state.selectedFlight)}
                    className="form-submit to-purchase-button"
                    onClick={this.handlePurchase.bind(this)}>
              Confirm
            </button>
          </div>
        </div>
        <Footer footerText="© FlightScanner Ltd 2018-2019"/>
      </div>
    );
  }
}

export default Purchase;
