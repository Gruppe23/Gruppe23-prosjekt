import React from 'react';
import ReactDOM from 'react-dom';
import { employee } from './services.js'
import { Link, HashRouter, Switch, Route } from 'react-router-dom';


class Start extends React.Component {
  render() {
    return (
    <div className="login">
    <span className="title">Røde Kors</span>
      <div className="loginContent">
        <div className="loginelements">
        <span>login<p></p></span>
        <input type="text" id="loginMail"></input><p></p>
        <span>password<p></p></span>
        <input type="password" id="loginPassword"></input><p></p>
        <button onClick={login}>Login</button>
        <p></p>
        <button onClick={forside}>Load Frontpage</button>
        </div>
      </div>
    </div>
    );
  }
}
function start(){
  ReactDOM.render((
    <Start />
  ), document.getElementById("all"));
}

start()




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
        <button ref="Brukeroversikt">
          Brukeroversikt
        </button>
        </div>
        <div id="root">
        <span className="overskrift">Velkommen til Forsiden!</span>
        <button onClick={start}> Gå tilbake til testside </button>
        </div>
      </div>
    );
  }
    componentDidMount() {
      this.refs.forsidebutton.onclick = () => {
        start()
      };
    }
}
function login(){
  let mail = document.getElementById("loginMail").value
  let pass = document.getElementById("loginPassword").value
  console.log(mail + ' ' + pass)
  let callback;
  employee.getEmployee(mail).then((notes) => {
  console.log(notes[0].surname);
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
