// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import Calendar from 'react-calendar/dist/entry.nostyle';


class Kalender extends React.Component<{}> {
  render() {
    return(
      <div className="full kalender"> Kalender
        <Calendar
          className="react-calendar"
          showWeekNumber = {true}
          onClickDay = {(value) => alert('Clicked day: ', value)}
         />

      </div>
    )
  }
  componentDidMount(){

  }
}

export { Kalender }
