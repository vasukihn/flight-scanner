import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './index.css';

import Filter from './screens/filter/component';
import Purchase from './screens/purchase/component';

ReactDOM.render(
  <Router>
    <div className="container">
      <Route exact path="/" component={Filter}/>
      <Route exact path="/purchase" component={Purchase}/>
    </div>
  </Router>
  , document.getElementById('root')
);