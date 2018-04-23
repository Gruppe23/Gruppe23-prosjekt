//POPUP I ADMINPAGE som lar admin opprette ny bruker
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import {RegisterWindow} from '../../registerwindow';
import { employee } from '../../services';
import { AdminPage} from '../Adminpage';
var passwordHash = require('password-hash');
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
     response: ?HTMLInputElement
   }

   constructor(props) {
     super(props);
     userCreateRef = this;
     let closePopup = this.props.closePopup
   }

  render() {
    return (
    <div className="popup">
      <div className="popup_inner">
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

          <div className="form-group">
              <label className="control-label col-sm-8" htmlFor="tlf">Telefonnummer:</label>
                  <input type="confirmemail" className="form-control" ref="tlf" placeholder="Enter email"/>
          </div>

        <div className="form-group-horizontal">
                <button type="button" ref="Signupbtn" className="btn btn-default" onClick={this.register}>Opprett Bruker</button>
                <button type="button" className="btn btn-default" onClick={this.props.closePopup}> Lukk </button>
        </div>
        <div ref="response"></div>

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
        <label className="control-label col-sm-4">Sted: </label>
        <input type="text" className="form-control" ref="place" placeholder="Fornavn"/>
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

register(props){
    if (userCreateRef.refs.pwd.value == userCreateRef.refs.confirmpwd.value && userCreateRef.refs.email.value == userCreateRef.refs.confirmemail.value){
      if(userCreateRef.refs.pwd.value != "" || userCreateRef.refs.email.value != "" || userCreateRef.refs.adress.value != "" ){
        let hashedPassword = passwordHash.generate(userCreateRef.refs.pwd.value);
        employee.signUp(userCreateRef.refs.firstname.value, userCreateRef.refs.surname.value, userCreateRef.refs.email.value, userCreateRef.refs.adress.value, userCreateRef.refs.zipcode.value, userCreateRef.refs.place.value, hashedPassword, userCreateRef.refs.username.value, userCreateRef.refs.tlf.value).then(() => {
          userCreateRef.refs.response.textContent = "Brukerkonto for " + userCreateRef.refs.firstname.value + " " + userCreateRef.refs.surname.value + " har blitt opprettet."
          userCreateRef.refs.response.style.color = "green"
          userCreateRef.refs.firstname.value = ""
          userCreateRef.refs.surname.value = ""
          userCreateRef.refs.email.value = ""
          userCreateRef.refs.confirmemail.value = ""
          userCreateRef.refs.adress.value = ""
          userCreateRef.refs.place.value = ""
          userCreateRef.refs.zipcode.value = ""
          userCreateRef.refs.pwd.value = ""
          userCreateRef.refs.confirmpwd.value = ""
          userCreateRef.refs.username.value = ""
        }).catch((error)=>{
          userCreateRef.refs.response.innerHTML = errorMessage
          userCreateRef.refs.response.style.color = "red"
        })
      }else{
        userCreateRef.refs.response.textContent = "Områder i regsitreringsskjemaet kan ikke være tomme."
        userCreateRef.refs.response.style.color = "red"
      }//1stIf
    } else {
      if(userCreateRef.refs.pwd.value == userCreateRef.refs.confirmpwd.value) {
        userCreateRef.refs.response.textContent = "Emailene matcher ikke."
        userCreateRef.refs.response.style.color = "red"
      }else {
        userCreateRef.refs.response.textContent = "Passordene matcher ikke."
        userCreateRef.refs.response.style.color = "red"

      }

    }
  }
}

export { AdminPageUserCreate }
