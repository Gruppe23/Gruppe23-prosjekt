// @ Flow

var passwordHash = require('password-hash');
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { employee } from "./services"
import { forside2 } from "./forside.js"
import { ProgramRender, programRender } from "./app.js"
import {User} from './services';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

class LoginWindow extends React.Component<{}> {
  constructor(){
    super();
  }
  refs: {
    login: HTMLInputElement,
    loginMail: HTMLInputElement,
    loginPassword: HTMLInputElement,
  }

  render() {
    return(
      <div className="login">
            <div className="loginelements">
                <span>Login<p></p></span>
                <input type="text" ref="loginMail"></input><p></p>
                <span>Password<p></p></span>
                <input type="password" compareFn="loginPassword"></input><p></p>
                <button ref="login">Login</button>
                <p></p>
                <button><Link to='/page2'>Til Registrering</Link></button>
            </div>
        </div>
    );
  }

  componentDidMount() {
    this.refs.login.onclick = () => {
      let mail: string = this.refs.loginMail.value
      let pass: string = this.refs.loginPassword.value
      console.log(mail + ' ' + pass)
      employee.getLogin(mail).then((notes: User) => {
        console.log(notes.password);
        console.log(notes)

        if (passwordHash.verify(pass, notes.password) == true) {
          alert("password match")
          localStorage.removeItem('signedInUser')
          localStorage.setItem('signedInUser', JSON.stringify(notes))
          programRender.forceUpdate();
        } else {
          alert("password does not match")
        }
    }).catch((error) => {
      console.log('Error getting notes: ' + error);
    });
  }
console.log("LoginWindow Did mount")
  };
}

export { LoginWindow }
