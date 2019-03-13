import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import {DatePicker, Select, Slider, Table} from 'antd';
import {isEmpty, isNil} from 'ramda';
import {SpiralSpinner} from 'react-spinners-kit';
import 'antd/dist/antd.css';
import './style.css';

import Header from '../../components/header/component';
import Footer from '../../components/footer/component';
import TitleBar from '../../components/title-bar/component';

const backendUrl = `http://${window.location.hostname}:3001`;

const Option = Select.Option;

class Filter extends Component {
  state = {
    isLoading: false,
    origin: [],
    destination: [],
    selectedOrigin: null,
    selectedDestination: null,
    selectedPriceRange: [0, 100],
    sliderDisabled: true,
    selectedDepartureDate: moment(),
    datePickerDisabled: true,
    selectedFlight: null,
    flights: [],
    height: window.innerHeight
  };

  componentDidMount() {
    this.fetchOriginAndDestinationLists();

    window.addEventListener('resize', this.updateHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeight);
  }

  fetchOriginAndDestinationLists = () => {
    this.setState({isLoading: true});

    axios.get(`${backendUrl}/flights/origins`)
      .then(response => {
        const jsonResponse = response.data;

        this.setState({origin: jsonResponse});

        return axios.get(`${backendUrl}/flights/destinations`);
      })
      .then(response => {
        const jsonResponse = response.data;

        this.setState({isLoading: false, destination: jsonResponse});
      })
      .catch(error => {
        const errorResponse = error.response;

        this.setState({isLoading: false});

        console.log(`error! ${errorResponse}`);
      });
  };

  isDataForFlightFetchingDefined = () => {
    const {selectedOrigin, selectedDestination, selectedPriceRange, selectedDepartureDate} = this.state;

    return !(isNil(selectedOrigin) || isNil(selectedDestination) || isEmpty(selectedPriceRange) || isNil(selectedDepartureDate));
  };
  resetSelection = () => this.setState({selectedRowId: null, selectedFlight: null});
  updateHeight = () => this.setState({height: window.innerHeight});
  handleToPurchase = () => this.props.history.replace('/purchase', {selectedFlight: this.state.selectedFlight});
  handleOriginChange = value => this.setState({selectedOrigin: value}, () => this.fetchFilteredFlights());
  handleDestinationChange = value => this.setState({selectedDestination: value}, () => this.fetchFilteredFlights());
  handleDepartureDateChange = value => this.setState({selectedDepartureDate: value}, () => this.fetchFilteredFlights());
  handlePriceSliderChange = value => this.setState({selectedPriceRange: value}, () => this.fetchFilteredFlights());

  fetchFilteredFlights = () => {
    if (this.isDataForFlightFetchingDefined()) {
      this.resetSelection();

      axios.get(`${backendUrl}/flights/byOriginAndDestinationAndMinPriceMaxPriceAndDepartureDate`, {
        params: {
          origin: this.state.selectedOrigin,
          destination: this.state.selectedDestination,
          minPrice: this.state.selectedPriceRange[0],
          maxPrice: this.state.selectedPriceRange[1],
          departureDate: this.state.selectedDepartureDate.startOf('day').valueOf(),
          departureEndDate: this.state.selectedDepartureDate.endOf('day').valueOf()
        }
      })
        .then(response => {
          const jsonResponse = response.data;

          this.setState({isLoading: false, flights: jsonResponse});
        })
        .catch(error => {
          const errorResponse = error.response;

          this.setState({isLoading: false});

          console.log(`error! ${errorResponse}`);
        });
    }
  };

  render() {
    const optionsOrigins = this.state.origin.map((option, index) => <Option key={index}
                                                                            value={option}>{option}</Option>);
    const optionsDestinations = this.state.destination.map((option, index) => <Option key={index}
                                                                                      value={option}>{option}</Option>);
    const placeholderOrigins = `Choose origin`;
    const placeholderDestination = `Choose destination`;
    const flightsTableColumns = [
      {
        title: 'Origin',
        dataIndex: 'origin',
        key: 'origin',
        width: 150
      },
      {
        title: 'Destination',
        dataIndex: 'destination',
        key: 'destination',
        width: 150
      },
      {
        title: 'Departure',
        dataIndex: 'departure',
        key: 'departure',
        width: 150,
        render: date => moment(date).format('MMMM Do YYYY, h:mm:ss a'),
        sorter: (a, b) => moment(a.departure).valueOf() - moment(b.departure).valueOf(),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'ascend'
      },
      {
        title: 'Arrival',
        dataIndex: 'arrival',
        key: 'arrival',
        width: 150,
        render: date => moment(date).format('MMMM Do YYYY, h:mm:ss a'),
        sorter: (a, b) => moment(a.arrival).valueOf() - moment(b.arrival).valueOf(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width: 150,
        render: price => `€${price}`,
        sorter: (a, b) => a.price - b.price,
        sortDirections: ['descend', 'ascend']
      }
    ];
    const flightsTable = <Table columns={flightsTableColumns}
                                scroll={{y: this.state.height / 2.3}}
                                rowKey={(record, index) => record.id}
                                rowClassName={ (record, index) => this.state.selectedRowId === record.id ? 'selected-row' : ''}
                                onRow={(record, rowIndex) => {
                                  return {
                                    onClick: event => {
                                      const isDeselecting = this.state.selectedRowId === record.id;

                                      this.setState({
                                        selectedRowId: isDeselecting ? null : record.id,
                                        selectedFlight: isDeselecting ? null : this.state.flights.find(flight => flight.id === record.id)
                                      })
                                    }
                                  };
                                }}
                                dataSource={this.state.flights}/>;
    const marks = {0: '0 €', 100: '100 €'};
    const priceRangeSlider = <Slider range
                                     onAfterChange={this.handlePriceSliderChange.bind(this)}
                                     defaultValue={this.state.selectedPriceRange}
                                     marks={marks}/>;
    const middleBody = isNil(this.state.selectedOrigin) || isNil(this.state.selectedDestination) ? '' :
      <div className="middle-body">
        <div className="middle-body-top-panel">
          <div className="middle-body-top-left-panel">
            <div className="middle-body-top-left-panel-label">
              Price range:
            </div>
            <div className="middle-body-top-left-panel-slider">
              {priceRangeSlider}
            </div>
            <div className="middle-body-top-left-panel-label">
              Departure date:
            </div>
            <div className="middle-body-top-left-panel-date-picker">
              <DatePicker defaultValue={this.state.selectedDepartureDate}
                          allowClear={false}
                          format="MMMM Do YYYY"
                          onChange={this.handleDepartureDateChange.bind(this)}/>
            </div>
          </div>
          <div className="middle-flight-list-container">
            {flightsTable}
          </div>
        </div>
        <div className="middle-button-container">
          <button type="button"
                  disabled={isNil(this.state.selectedFlight)}
                  className="form-submit to-purchase-button"
                  onClick={this.handleToPurchase.bind(this)}>
            Buy
          </button>
        </div>
      </div>;

    return (
      <div className="wrapper">
        <div className={this.state.isLoading ? 'overlay' : 'hidden'}/>
        <div className={this.state.isLoading ? 'loader-container' : 'hidden'}>
          <SpiralSpinner size={200}
                         frontColor="#0AA8FB"
                         backColor="#374F7D"
                         loading={this.state.isLoading}/>
        </div>
        <div className="filter-container">
          <Header headerText="FlightScanner"/>
          <div className="middle">
            <div className="middle-head">
              <TitleBar titleText="Search your flight"/>
              <div className="middle-origin-destination-filters">
                <div className="middle-origin-destination-filters-label"> Origin:</div>
                <Select style={{width: '100%'}}
                        showSearch
                        placeholder={placeholderOrigins}
                        optionFilterProp="children"
                        onChange={this.handleOriginChange}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  {optionsOrigins}
                </Select>
                <div className="middle-origin-destination-filters-label"> Destination:</div>
                <Select style={{width: '100%'}}
                        showSearch
                        placeholder={placeholderDestination}
                        optionFilterProp="children"
                        onChange={this.handleDestinationChange}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  {optionsDestinations}
                </Select>
              </div>
            </div>
            {middleBody}
          </div>
          <Footer footerText="© FlightScanner Ltd 2018-2019"/>
        </div>
      </div>
    );
  }
}

export default Filter;
