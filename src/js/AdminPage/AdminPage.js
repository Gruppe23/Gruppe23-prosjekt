//POPUP I ADMINPAGE som lar admin opprette ny bruker
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';

export default class AdminPageUserCreate extends React.Component {
  render() {
    return (
    <div className="popup">
      <div className="popup_inner">
        <form className="form-horizontal">
          <span> Opprett Brukerkonto </span>
          <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="email">Email:</label>
              <div className="col-xs-4">
                <input type="email" className="form-control" id="email" placeholder="Enter email"/>
              </div>
          </div>
          <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="email">Bekreft Email:</label>
              <div className="col-xs-4">
                  <input type="email" className="form-control" id="email" placeholder="Enter email"/>
              </div>
          </div>
          <div className="form-group">
              <label className="control-label col-xs-2" htmlFor="pwd">Password:</label>
              <div className="col-xs-4">
                  <input type="password" className="form-control" id="pwd" placeholder="Enter password"/>
              </div>
          </div>
        <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
                <button type="submit" className="btn btn-default">Submit</button>
                <button onClick={this.props.closePopup}> Lukk </button>
            </div>
        </div>
    </form>
    </div>

    </div>
    )
  }
}
