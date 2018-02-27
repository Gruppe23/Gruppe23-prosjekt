import React from 'react';
import ReactDOM from 'react-dom';
import { employee } from './services.js'
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
var passwordHash = require('password-hash');
var hashedPassword = passwordHash.generate('bass32');
console.log(hashedPassword)

//============================================================================================================================
//=========================================Login / Regster - RENDER========================================================
//============================================================================================================================
class LoginRender extends React.Component {
  render() {
    return (
    <div className="login">
    <span className="title">Røde Kors</span>
      <div className="loginContent" id="loginContent">
{/*  Vi har innholdet innad i firkanten vi ser på login i en egen render, fordi vi skal ha registreringsvinduet
  i samme firkanten. Slik at vi kan rendre login tilbake og ikke rendre like mye.*/}
          <LoginWindow />
      </div>
    </div>
    );
  }
}

//Vi lager elementene som vi bruker til å logge inn med. Samt en register knapp som lar oss bytte innholdet i loginelements div'en til et registreringsskjema.
class LoginWindow extends React.Component {
  render() {
    return (
      <div className="loginelements">
        <span>Login<p></p></span>
        <input type="text" id="loginMail"></input><p></p>
        <span>Password<p></p></span>
        <input type="password" id="loginPassword"></input><p></p>
        <button onClick={login}>Login</button>
        <p></p>
        <button onClick={forside}>Load Frontpage</button>
        <p></p>
        <button onClick={renderRegister}>Til Registrering</button>
      </div>
    );
  }
}

class Register extends React.Component {
  render() {
    return (
      <div className="registerelements">
        <span>Fornavn: </span> <input type="text" id="registerFirstName"></input><p></p>
        <span>Etternavn: </span> <input type="text" id="registerFirstName"></input><p></p>
        <span>Mail: </span> <input type="text" id="registerMail"></input><p></p>
        <span>Passord: </span> <input type="password" id="registerPassword"></input><p></p>
        <span>Passord Controll: </span> <input type="password" id="registerControllPassword"></input><p></p>
        <button>Registrer</button>
        <p></p>
        <button>Tilbake til login</button>
        <p></p>
        <button onClick={forside}>Load Frontpage</button>
        <p></p>
      </div>
    );
  }
}

//På appstart får vi opp login vinduet. Altså klassen LoginRender blir loadet. Klassen LoginRender
//rendrer automatisk loginvinduet. og har muligheten til å rendre registreringsvinduet innad i seg selv
//Fra en knapp.

function renderLogin(){
  ReactDOM.render((
    <LoginRender />
  ), document.getElementById("all"));
}

function renderRegister(){
  ReactDOM.render((
    <Register />
  ), document.getElementById("loginContent"))
}

renderLogin()





//============================================================================================
//========================================FORSIDE==============================================
//============================================================================================

class Forside extends React.Component {
  render() {
    return (
      <div className="full">
        <div id="taskbar">
        <button ref="forsidebutton">
          Forside
        </button>
        <button ref="kalenderbutton">
        kalender
        </button>
        <button ref="brukeroversikt">
          Brukeroversikt
        </button>
        </div>
        <div id="root">
        <span className="overskrift">Velkommen til Forsiden!</span>
        <button onClick={renderLogin}> Gå tilbake til testside </button>
        </div>
      </div>
    );
  }
    componentDidMount() {
      this.refs.forsidebutton.onclick = () => {
        renderLogin()
      };
    }
}
//======================================================================================================
//======================================================================================================
//======================================================================================================
function login(){
  let mail = document.getElementById("loginMail").value
  let pass = document.getElementById("loginPassword").value
  console.log(mail + ' ' + pass)
  employee.getLogin(mail).then((notes) => {
  console.log(notes[0].password);
  if (passwordHash.verify(pass, notes[0].password) == true) {
    alert("password match")

  } else {
    alert("password does not match")

  }
}).catch((error) => {
  console.log('Error getting notes: ' + error);
});
  // for (let x in object){ console.log(object[x])}
}

function forside(){
  ReactDOM.render((
    <Forside />
  ), document.getElementById('all'));
}
