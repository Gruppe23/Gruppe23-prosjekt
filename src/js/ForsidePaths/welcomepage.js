// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { employee } from '../services';

const divStyle = {
  position: "relative"
};

const topContainer = {
  height: "70%",
};


const topLeftContainer = {
  float: "left",
  height: "100%",
  backgroundColor: "#696969"
}

const topLeftInner1 = {
 inline: "block",
 height: "50%",
 padding: "15px",
 maxHeight: "50%"
}

const topleftInner2 = {
height: "50%",
padding: "15px"
}

const topRightContainer = {
  paddingLeft: "15px",
  paddingRight: "0px",
  float: "left",
  backgroundImage: "linear-gradient(#696969,#696969)",
  backgroundClip: "content-box, padding-box",
  height: "100%"
}

const topRightInner = {
  inline: "block",
  height: "100%",
  paddingLeft: "30px",
  paddingRight: "30px",
  paddingTop: "15px",
  paddingBottom: "15px"
}

const kalenderShow = {
  height: "30%",
  padding: "15px",
  backgroundImage: "linear-gradient(#696969,#696969)",
  backgroundClip: "content-box, padding-box",
};

class WelcomePage extends React.Component<{}> {
  render(){
    let user = employee.getSignedInUser2()
    let panes
    if (user.user_type == 2) {

    }else{

    }

    return (
  <div className="full" style={divStyle}>
    <div className="container-fluid" style={topContainer}>
      <div className="col-md-8" style={topLeftContainer}>
        <div className="row">
        <div className="col-md-12" style={topLeftInner1}>
          <img src="src/pictures/velkommen-bilde.png" alt="Velkommenbilde"/>
        </div>
        </div>
        <div className="row">
          <div className="col-md-12" style={topleftInner2}>
            <span>Hvis vi får tid</span>
          </div>
        </div>
      </div>
      <div className="col-md-4" style={topRightContainer}>
        <div className="row">
          <div className="col-md-12" style={topRightInner}>
          <span>Her skal meldinger være</span>
          </div>
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

  componentDidMount(){
    employee.getSignedInUser().then((user) =>{
      employee.getFrontPageShifts(user.user_id).then((shifts) => {
      })
    })
  }
}

export { WelcomePage }
