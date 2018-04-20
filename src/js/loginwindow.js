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
                <input type="text" ref="loginUsername"></input><p></p>
                <span>Password<p></p></span>
                <input type="password" ref="loginPassword"></input><p></p>
                <button ref="login" onClick= {() => {this.login()}}>Login</button>
                <p></p>
                <Link to='/page2'><button>Til Registrering</button></Link>
            </div>
        </div>
    );
  }
 login(){
     let username: string = this.refs.loginUsername.value
     let pass: string = this.refs.loginPassword.value
     employee.getLogin(username).then((notes: User) => {
       console.log(notes)
       if (passwordHash.verify(pass, notes.password) == true && notes.status == 1)  {
         alert("password match")
         localStorage.removeItem('signedInUser')
         localStorage.setItem('signedInUser', JSON.stringify(notes))
         programRender.forceUpdate();
       } else if(notes.status == 1) {
         alert("password does not match")
       } else {
         alert("Your account is not verified")
       }
   }).catch((error) => {
     console.log('Error getting notes: ' + error);
   });
 }

}

export { LoginWindow }
