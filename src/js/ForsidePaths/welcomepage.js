// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';

const divStyle = {
  position: "relative"
};

const topContainer = {
  height: "75%"
};

const kalenderShow = {
  bottom: "0",
  position: "absolute",
  height: "150px",
  width: "100%"
};

const topLeftContainer = {
  float: "left"
}

const topLeftInner1 = {
 inline: "block",
}

const topleftInner2 = {

}

const topRightContainer = {
  float: "left"
}
class WelcomePage extends React.Component<{}> {
  render(){
    return (
  <div className="full" style={divStyle}>
    <div className="container-fluid" style={topContainer}>
      <div className="row">
      <div className="col-md-6" style={topLeftContainer}>
        <div className="container" style={topLeftInner1}>
      <span> Velkommen til Røde Kors appen! </span>
      </div>
      <div className="container" style={topleftInner2}>
        <span>Hvis vi får tid</span>
      </div>
      </div>
      <div className="col-md-6" style={topRightContainer}>
        <span>Her skal meldinger være</span>
      </div>
    </div>
    </div>
      <div className="container-fluid" style={kalenderShow}>
        <div className="col-sm-12">
            <div className="col-sm-2">
              Kalenderdag
            </div>
            <div className="col-sm-2">
              Kalenderdag
            </div>
            <div className="col-sm-2">
              Kalenderdag
            </div>
            <div className="col-sm-2">
              Kalenderdag
            </div>
            <div className="col-sm-2">
              Kalenderdag
            </div>
            <div className="col-sm-2">
              Kalenderdag
            </div>
          </div>
        </div>
      </div>
  )
  }
}

export { WelcomePage }
