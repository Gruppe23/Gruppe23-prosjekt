import React from 'react';
import ReactDOM from 'react-dom';
import { employee } from './services.js'
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
var passwordHash = require('password-hash');
var hashedPassword = passwordHash.generate('bass32');
console.log(hashedPassword)
let loginState;

//======================================================================================================
//==========Rendering==========================================================================
//======================================================================================================
//ProgramRender er hoved DOM Objektet hvor alle andre DOM objekter blir dynamisk endret ved hjelp av React State.
class ProgramRender extends React.Component {
  constructor() {
    super();
    this.startpage = this.startpage.bind(this); //Vi binder this.startpage, enkelt forklart lar det oss bruke this.startpage i klassen for å
    this.frontpage = this.frontpage.bind(this);
    this.state = {screen: <Verification startpage={this.startpage}
                                        frontpage={this.frontpage} />}
                  }

    startpage() {
      this.setState({screen: <Verification startpage={this.startpage}
                                           frontpage={this.frontpage}/>})
      }

      frontpage() {
        this.setState({screen: <FrontPage logout={this.startpage}/>})
      }
      render() {
        return (
          <div className="full">
          {this.state.screen}
          </div>
        );

      }
}
//Verification er vinduet hvor vi håndterer login/registrasjon til appen.
class Verification extends React.Component {
  constructor() {
    super();
    this.loginWindow= this.loginWindow.bind(this)
    this.registerWindow = this.registerWindow.bind(this)
    this.loadFrontPage = this.loadFrontPage.bind(this)
    this.state = { verification: <LoginWindow
                    loginWindow={this.loginWindow}
                    registerWindow={this.registerWindow}
                    loadFrontPage={this.loadFrontPage}/>
                  }
    }

    render() {
      return (
      <div className="login">
      <img src="./src/pictures/roede-kors.jpg" className="title"></img>
      <div className="loginContent" id="loginContent">
          {/*  Vi har innholdet innad i firkanten vi ser på login i en egen render, fordi vi skal ha registreringsvinduet
            i samme firkanten. Slik at vi kan rendre login tilbake og ikke rendre like mye.*/}
            {this.state.verification}
        </div>
      </div>
      );
    }

    loginWindow(){
      this.setState({verification: <LoginWindow
                    registerWindow={this.registerWindow}
                    loadFrontPage={this.loadFrontPage}/>})
    }

    registerWindow() {
      this.setState({verification: <RegisterWindow
                    loginWindow={this.loginWindow}
                    loadFrontPage={this.loadFrontPage}/>
                  })
    }

    loadFrontPage() {
      this.props.frontpage()
    }
}
//LoginWindow er DOM objektet som loades inn i Verification som default og når vi evt ferdiggjør registrering/velger å gå tilbake.
class LoginWindow extends React.Component {
  render() {
    return(
            <div className="loginelements">
                <span>Login<p></p></span>
                <input type="text" id="loginMail"></input><p></p>
                <span>Password<p></p></span>
                <input type="password" id="loginPassword"></input><p></p>
                <button onClick={this.loginCheck} >Login</button>
                <p></p>
                <button onClick={this.props.loadFrontPage}>Load Frontpage</button>
                <p></p>
                <button onClick={this.props.registerWindow}> Til Registrering</button>
            </div>
    )
  }
  loginCheck() {
    let verifyLogin = login()
    if (verifyLogin == true){

    }
  }
}
//RegisterWindow er DOM objektet som loades inn i Verification hvis vi trykker på register knapen.
class RegisterWindow extends React.Component {
  render() {
    return(
            <div className="registerelements">
                <span>Fornavn: </span> <input type="text" id="registerFirstName"></input><p></p>
                <span>Etternavn: </span> <input type="text" id="registerFirstName"></input><p></p>
                <span>Mail: </span> <input type="text" id="registerMail"></input><p></p>
                <span>Passord: </span> <input type="password" id="registerPassword"></input><p></p>
                <span>Passord Controll: </span> <input type="password" id="registerControllPassword"></input><p></p>
                <button>Registrer</button>
                <p></p>
                <button onClick={this.props.loginWindow}>Tilbake til login</button>
                <p></p>
                <button onClick={this.props.loadFrontPage}>Load Frontpage</button>
                <p></p>
            </div>
    )
  }
}
//FrontPage er DOM Objektet som loades hvis en bruker lykkes i å logge inn.
class FrontPage extends React.Component {
  render(){
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
          <button id="logoutBTN" onClick={this.props.logout}>Logout</button>
        </div>
        <div id="root">
          <span className="overskrift">Velkommen til Forsiden!</span>
          <button> Gå tilbake til testside </button>
        </div>
      </div>
    )
  }
}

//====================================================================================================
//=======Functions====================================================================================
//====================================================================================================

function login(){
  let mail = document.getElementById("loginMail").value
  let pass = document.getElementById("loginPassword").value
  console.log(mail + ' ' + pass)
  employee.getLogin(mail).then((notes) => {
  console.log(notes[0].password);
  if (passwordHash.verify(pass, notes[0].password) == true) {
      alert("password match")
      return true

  } else {
      alert("password does not match")
      return false

  }
}).catch((error) => {
    console.log('Error getting notes: ' + error);
});
  // for (let x in object){ console.log(object[x])}
}

function forside(){
    ReactDOM.render((
        <ProgramRender />
  ), document.getElementById('all'));
}

forside()
