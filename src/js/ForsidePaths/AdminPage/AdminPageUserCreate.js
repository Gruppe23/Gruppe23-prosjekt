//POPUP I ADMINPAGE som lar admin opprette ny bruker
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import {RegisterWindow} from '../../registerwindow';
import { employee } from '../../services';

let userCreateRef;
 class AdminPageUserCreate extends React.Component<{}> {
   refs: {
     Signupbtn: ?HTMLButtonElement,
     firstname: ?HTMLInputElement,
     surname: ?HTMLInputElement,
     email: ?HTMLInputElement,
     confirmemail: ?HTMLInputElement,
     pwd: ?HTMLInputElement,
     confirmpwd: ?HTMLInputElement,
     adress: ?HTMLInputElement,
     username: ?HTMLInputElement,
     zipcode: ?HTMLInputElement,
   }
   constructor() {
     super();
     userCreateRef = this;
   }

  render() {
    return (
    <div className="popup">
      <div className="row popup_inner">
      <div className="col-sm-6">
        <form className="form">
          <span>Brukerinfo </span>
          <div className="form-group">
              <label className="control-label col-sm-4" htmlFor="firstname">Fornavn:</label>
                <input type="text" className="form-control" ref="firstname" placeholder="Fornavn"/>
          </div>
          <div className="form-group">
              <label className="control-label col-sm-4" htmlFor="surname">Etternavn:</label>
                <input type="text" className="form-control" ref="surname" placeholder="Fornavn"/>
          </div>
          <div className="form-group">
              <label className="control-label col-sm-4" htmlFor="email">Email:</label>
                <input type="email" className="form-control"  ref="email" placeholder="Enter email"/>

          </div>
          <div className="form-group">
              <label className="control-label col-sm-8" htmlFor="confirmemail">Bekreft Email:</label>
                  <input type="confirmemail" className="form-control" ref="confirmemail" placeholder="Enter email"/>
          </div>

        <div className="form-group-horizontal">
                <button ref="Signupbtn" className="btn btn-default" onClick={this.register}>Opprett Bruker</button>
                <button className="btn btn-default" onClick={this.props.closePopup}> Lukk </button>
        </div>

    </form>

    </div>
    <div className="col-sm-6">
        <span>Kontoinfo</span>
    <form className="form">
    <div className="form-group">
        <label className="control-label col-sm-4">Adresse: </label>
        <input type="text" className="form-control" ref="adress" placeholder="Fornavn"/>
    </div>
    <div className="form-group">
        <label className="control-label col-sm-4">Postnr: </label>
        <input type="text" className="form-control" ref="zipcode" placeholder="Fornavn"/>
    </div>
    <div className="form-group">
        <label className="control-label col-sm-4" htmlFor="username">Brukernavn: </label>
        <input type="text" className="form-control" ref="username" placeholder="Fornavn"/>
    </div>
    <div className="form-group">
        <label className="control-label col-sm-4" htmlFor="pwd">Passord:</label>
        <input type="password" className="form-control" ref="pwd" placeholder="Enter password"/>
    </div>
    <div className="form-group">
        <label className="control-label col-sm-10" htmlFor="confirmpwd">Bekreft Passord: </label>
        <input type="password" className="form-control" ref="confirmpwd" placeholder="Enter password"/>
    </div>
    </form>
    </div>
    </div>
    </div>
    )
}

register(){
    console.log("trykka")
    if (userCreateRef.refs.pwd.value == userCreateRef.refs.confirmpwd.value && userCreateRef.refs.email.value == userCreateRef.refs.confirmemail.value){
      console.log("success")
        employee.signUp(userCreateRef.refs.firstname.value, userCreateRef.refs.surname.value, userCreateRef.refs.email.value, userCreateRef.refs.adress.value, userCreateRef.refs.zipcode.value, userCreateRef.refs.pwd.value, userCreateRef.refs.adress.value)
    } else {
      console.log("fail")
    }
  }
}

export { AdminPageUserCreate }
