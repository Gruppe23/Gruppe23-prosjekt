import React from 'react';
import ReactDOM from 'react-dom';
import AdminPageUserCreate from "./AdminPage/AdminPage.js"
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
var passwordHash = require('password-hash');
var hashedPassword = passwordHash.generate('bass32');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
console.log(hashedPassword)
let loginState;
console.log(window.innerWidth + "Width + Height" + window.innerHeight)


//======================================================================================================
//==========Rendering==========================================================================
//======================================================================================================
//ProgramRender er hoved DOM Objektet hvor alle andre DOM objekter blir dynamisk endret ved hjelp av React State.

let LoginWindowRef;
let ProgramRenderRef;
let VerificationRef;
let FrontPageRef;
let ProfilSideRef;
let RegisterWindowRef;

class ProgramRender extends React.Component {
  constructor() {
    super();
    ProgramRenderRef = this;
    this.startpage = this.startpage.bind(this); //Vi binder this.startpage, enkelt forklart lar det oss bruke this.startpage i klassen for å
    this.loadFrontPage = this.loadFrontPage.bind(this);
    this.state = {screen: <Verification startpage={this.startpage}
                                        frontpage={this.frontpage} />}
                  }

    startpage() {
      this.setState({screen: <Verification startpage={this.startpage}
                                           frontpage={this.frontpage}/>})
      }

      loadFrontPage() {
        this.setState({screen: <FrontPage logout={this.startpage}/>})
      }

      render() {
        return (
          <div id="full">
              {this.state.screen}
          </div>
        );
      }
      componentDidMount(){
        ProgramRenderRef = this;
      }
}
//Verification er vinduet hvor vi håndterer login/registrasjon til appen.
//AKA LOGIN/REGISTGER WINDOW
class Verification extends React.Component {
  constructor() {
    super();
    VerificationRef = this;
    this.loginWindow= this.loginWindow.bind(this)
    this.registerWindow = this.registerWindow.bind(this)
    this.state = { verification: <LoginWindow />}
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
      //Endrer staten, alstå området "this.state.verification" renderen over til loginskjema.
      this.setState({verification: <LoginWindow/>})
    }

    registerWindow() {
      //Endrer staten, alstå området "this.state.verification" renderen over til registreringsjema.
      this.setState({verification: <RegisterWindow/>})
    }


    componentDidMount(){
      VerificationRef = this;
    }
}
//LoginWindow er DOM objektet som loades inn i Verification som default og når vi evt ferdiggjør registrering/velger å gå tilbake.
class LoginWindow extends React.Component {
  constructor(){
    super();
  }

  render() {
    return(
            <div className="loginelements">
                <span>Login<p></p></span>
                <input type="text" id="loginMail"></input><p></p>
                <span>Password<p></p></span>
                <input type="password" id="loginPassword"></input><p></p>
                <button ref="login">Login</button>
                <p></p>
                <button onClick={ProgramRenderRef.loadFrontPage}>Load Frontpage</button>
                <p></p>
                <button onClick={VerificationRef.registerWindow}> Til Registrering</button>
            </div>
    );
  }

  componentDidMount() {
    this.refs.login.onclick = () => {
      let mail = document.getElementById("loginMail").value
      let pass = document.getElementById("loginPassword").value
      console.log(mail + ' ' + pass)
      employee.getLogin(mail).then((notes) => {
        console.log(notes[0].password);
        if (passwordHash.verify(pass, notes[0].password) == true) {
          alert("password match")
          ProgramRenderRef.loadFrontPage()
          localStorage.removeItem('signedInUser')
          localStorage.setItem('signedInUser', JSON.stringify(notes[0]))
        } else {
          alert("password does not match")
        }
    }).catch((error) => {
      console.log('Error getting notes: ' + error);
    });
  }
  LoginWindowRef = this
  };
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
                <button onClick={Verification.loginWindow}>Tilbake til login</button>  <button>Registrer</button>
                <p></p>
            </div>
    )
  }

  componentDidMount(){
    RegisterWindowRef = this;
  }
}
//FrontPage er DOM Objektet som loades hvis en bruker lykkes i å logge inn.
class FrontPage extends React.Component {
  constructor(){
    super();
    FrontPageRef = this;
    this.FrontPage = this.FrontPage.bind(this)
    this.minProfil = this.minProfil.bind(this)
    this.minKalender = this.minKalender.bind(this)
    this.state = {page: <FrontPageInfo />}
  }

  render(){
    let item = localStorage.getItem('signedInUser')
    let userInfo = JSON.parse(item)
    console.log(userInfo)
    let admin;
    if(userInfo.user_type == 2){
       admin = <button id='logoutBTN' onClick={this.adminPage}>Admin Page </button>;
    } else {
      admin = <span> Velkommen til Røde Kors appen!</span>;
    }

    return (
      <div className="full">
        <div id="taskbar">
          <button onClick={this.FrontPage}>
          Forside
          </button>
          <button onClick={this.minKalender}>
          kalender
          </button>
          <button onClick={this.brukeroversikt}>
          Brukeroversikt
          </button>
          <button onClick={this.minProfil}> profilside </button>
          {admin}
          <button id="logoutBTN" onClick={ProgramRenderRef.startpage}>Logout</button>
        </div>
        <div id="root">
          {this.state.page}
        </div>
      </div>
    )

  }

  minProfil(){
    this.setState({page: <ProfilSide />})
  }

  minKalender(){
    this.setState({page: <Kalender />})
  }

  FrontPage(){
    FrontPageRef.setState({page: <FrontPageInfo />})
  }

  adminPage(){
    FrontPageRef.setState({page: <AdminPage />})
  }
  brukeroversikt(){
    FrontPageRef.setState({page: <Brukeroversikt />})
  }

  componentDidMount(){
    FrontPageRef = this;
  }
}

class Brukeroversikt extends React.Component {
  render(){
    return(
      <div> Brukeroversikt </div>
    )
  }
}

class ProfilSide extends React.Component {
  render(){
    return (
  <div>
    <span>Nils sin Profil</span>
    <button onClick={this.props.frontPageReturn}>Frontpage</button>
  </div>
  )
  }
}


class FrontPageInfo extends React.Component {
  render(){
    return(
      <span> Velkommen til Røde Kors! </span>
    )
  }
}

class Kalender extends React.Component {
  render() {
    return(
      <span> Kalender </span>
    )
  }
}

class AdminPage extends React.Component {
  constructor() {
    super()
    this.state = {userinfo: <div></div>,
                  showPopup: false}

  }
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  render(){

    return(
      <div className="AdminPage_Container">
      <div className="container-fluid hundre">


{this.state.showPopup ?
<AdminPageUserCreate
  text="Close Me"
  closePopup={this.togglePopup.bind(this)}
/>
:null
}

      <div className="input-group-sm hundre" id="AdminPage_LeftBox">

      <button id="Create Profile" onClick={this.togglePopup.bind(this)}>Oprrett Brukerprofil </button>

      </div>
      <div id="AdminPage_RightBox" className="grey hundre">
              </div>
      </div>
      </div>
    )

  }
  componentDidMount () {

  }
}
//POPUP I ADMINPAGE som lar admin opprette ny bruker

//====================================================================================================
//=======Functions====================================================================================
//====================================================================================================

function forside(){
    ReactDOM.render((
        <ProgramRender />
  ), document.getElementById('all'));
}

forside()
