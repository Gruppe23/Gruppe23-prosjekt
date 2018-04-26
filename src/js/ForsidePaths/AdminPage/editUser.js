//@flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { employee } from "../../services"
var passwordHash = require('password-hash');
let userEditRef;
export class EditUser extends React.Component<{}> {
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

  constructor() {
    super();
    userEditRef = this;
  }

  render() {
    return(
      <div className="popup">
        <div className="popup_inner">
        <div className="col-sm-6">
          <div className="form-group">
            <div className="form-group">
                <label className="control-label col-sm-4" htmlFor="firstname">Fornavn:</label>
                  <input type="text" className="form-control" ref="firstname" placeholder="Fornavn"/>
            </div>
            <div className="form-group">
                <label className="control-label col-sm-4" htmlFor="surname">Etternavn:</label>
                  <input type="text" className="form-control" ref="surname" placeholder="Etternavn"/>
            </div>

            <div className="form-group">
                <label className="control-label col-sm-4">Adresse: </label>
                <input type="text" className="form-control" ref="adress" placeholder="olanordmannsvei 24"/>
            </div>
            <div className="form-group">
                <label className="control-label col-sm-8" htmlFor="tlf">Poststed:</label>
                <input type="text" className="form-control" ref="poststed" placeholder='"Trondheim"'/>
            </div>
            <div className="form-group">
                <label className="control-label col-sm-4">Postnr: </label>
                <input type="text" className="form-control" ref="zipcode" placeholder="(XXXX)"/>
            </div>

            <div className="form-group">
                <label className="control-label col-sm-8" htmlFor="tlf">Telefonnummer:</label>
                <input type="text" className="form-control" ref="tlf" placeholder="(XXXXXXXX"/>
            </div>
          <div ref="response">Det er bare nødvendig å fylle ut feltene der du ønsker å endre brukerinformasjonen.</div>

      </div>

      </div>
      <div className="col-sm-6">
      <div className="form-group">

      <div className="form-group">
          <label className="control-label col-sm-4" htmlFor="username">Brukernavn: </label>
          <input type="text" className="form-control" ref="username" placeholder="Brukernavn"/>
      </div>
      <div className="form-group">
          <label className="control-label col-sm-4" htmlFor="pwd">Passord:</label>
          <input type="password" className="form-control" ref="pwd" placeholder="Enter password"/>
      </div>
      <div className="form-group">
          <label className="control-label col-sm-10" htmlFor="confirmpwd">Bekreft Passord: </label>
          <input type="password" className="form-control" ref="confirmpwd" placeholder="Enter password"/>
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
              <button ref="signupbtn" type="button" className="btn btn-default formBTN" onClick={this.update}>Send inn endringer</button>
              <button type="button" onClick={this.props.closePopup} className="formBTN btn btn-default">Lukk</button>
      </div>
      </div>
      </div>
      </div>
    </div>
    )
  }


  update(props){
    let editArray = {}
    userEditRef.refs.response.innerHTML = ""
    if(userEditRef.refs.pwd.value.length != undefined) {
      console.log(userEditRef.refs.pwd.value + " " + userEditRef.refs.confirmpwd.value)
    if (userEditRef.refs.pwd.value == userEditRef.refs.confirmpwd.value && userEditRef.refs.pwd.value.length > 5){
      let passwordValue = passwordHash.generate(userEditRef.refs.pwd.value)
      editArray.password = passwordValue
    }else {
      if(userEditRef.refs.pwd.value.length >= 6) {
        userEditRef.refs.response.innerHTML += "Passord må være like."
        userEditRef.refs.response.style.color += "red"
        console.log("notequalpass")
      }else{
        if(userEditRef.refs.pwd.value.length > 0){
      userEditRef.refs.response.innerHTML = "Passord må være lengre en 6 bokstaver."
      userEditRef.refs.response.style.color = "red"
      console.log("passlengtherr")
    }
    }
    }
    }
    if(userEditRef.refs.email.value.length != undefined){
    if(userEditRef.refs.email.value.length > 3 && userEditRef.refs.email.value == userEditRef.refs.confirmemail.value){
      editArray.email = userEditRef.refs.email.value
    } else if(userEditRef.refs.email.value.length > 0) {
      userEditRef.refs.response.innerHTML += "Vennligst fyll inn lik email i feltene."
      userEditRef.refs.response.style.color = "red"
      console.log("mailerror")
      Alert("Mailadressene du har skrevet inn er ikke like! \n Andre endringer har gått igjennom med mindre du får feilmelding på det. ")
    }
  }

    if(userEditRef.refs.username.value.length > 2) {
      editArray.username = userEditRef.refs.username.value
    }

    if(userEditRef.refs.firstname.value.length > 2){
      editArray.first_name = userEditRef.refs.firstname.value
    }

    if(userEditRef.refs.surname.value.length > 2) {
      editArray.surname = userEditRef.refs.surname.value
    }

    if(userEditRef.refs.tlf.value.length == 8){
      editArray.tlf = userEditRef.refs.tlf.value
  } else if(userEditRef.refs.tlf.value.length > 0){
    userEditRef.refs.response.innerHTML = "telefonnummer må være 8 tall"
    userEditRef.refs.response.style.color = "red"
    Alert("Passord må være 6 tegn eller lengre! \n Andre endringer har gått igjennom med mindre du får feilmelding på det. ")
  }

if(userEditRef.refs.zipcode.value.length == 4) {
  if(userEditRef.refs.zipcode.value.isNaN() == false) {
    editArray.zipcode = userEditRef.refs.zipcode.textContent
  }
}

if(userEditRef.refs.poststed.value.length > 2){
  editArray.place = userEditRef.refs.poststed.value
}

  if(userEditRef.refs.adress.value.length > 2) {
    editArray.adress = userEditRef.refs.adress.value
  }

  employee.editUser(editArray, userEditRef.props.user_id).then(()=>{
    userEditRef.refs.response.innerHTML = "Endringer utført!"
    userEditRef.refs.response.style.color = "green"
  }).catch((error: Error) => {
    alert("SUMTHANG WONG")
    console.log(error)
  })
}
  componentDidMount(){
      userEditRef = this;
  }
}
