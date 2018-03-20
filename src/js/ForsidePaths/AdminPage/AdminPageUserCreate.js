//POPUP I ADMINPAGE som lar admin opprette ny bruker
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';

 class AdminPageUserCreate extends React.Component {
  render() {
    return (
    <div className="popup">
        <form className="form-horizontal popup_inner">
          <span> Opprett Brukerkonto </span>
          <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="username">Fornavn:</label>
              <div className="col-xs-4">
                <input type="text" className="form-control" ref="firstname" placeholder="Fornavn"/>
              </div>
          </div>
          <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="surname">Etternavn:</label>
              <div className="col-xs-4">
                <input type="text" className="form-control" ref="firstname" placeholder="Fornavn"/>
              </div>
          </div>
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
              <label className="control-label col-xs-2" htmlFor="pwd">Passord:</label>
              <div className="col-xs-4">
                  <input type="password" className="form-control" id="pwd" placeholder="Enter password"/>
              </div>
          </div>
          <div className="form-group">
              <label className="control-label col-xs-2" htmlFor="pwd">Bekreft Passord:</label>
              <div className="col-xs-4">
                  <input type="password" className="form-control" id="pwd" placeholder="Enter password"/>
              </div>
          </div>
        <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
                <button className="btn btn-default">Opprett Bruker</button>
                <button className="btn btn-default" onClick={this.props.closePopup}> Lukk </button>
            </div>
        </div>


    </form>
    </div>
    )
  }
}

export { AdminPageUserCreate }
