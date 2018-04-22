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
var passwordHash = require('password-hash');

class LoginWindow extends React.Component<{}> {
  constructor(){
    super();
    this.state= {
      showPopup: false,
    }
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
                <button ref="forgotPassword" onClick={() => {this.togglePopup()}}>Glemt passord?</button>
                <p></p>
                <button><Link to='/page2'>Til Registrering</Link></button>
              {this.state.showPopup ?
                <ForgotPassword
                  closePopup={this.closePopup.bind(this)}
                />
                :null
              }
          </div>
        </div>
    );
  }

  closePopup(){
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  togglePopup() {
    new Promise((resolve,reject) =>{
      console.log('popup should appear')
      resolve()
    }).then(()=>{
      this.setState({
        showPopup: !this.state.showPopup
      });
    })
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

export class ForgotPassword extends React.Component <{}> {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="popup">
        <div className="popup_inner2">
            <div className="col-md-12 newPw">
            <h5>Skriv inn din email, så sender vi deg nytt passord<p></p></h5>
            <input type="text" ref="recipient" placeholder="Skriv inn E-mail"/>
            <p></p>
            <button ref="newPwButton">Send nytt passord</button>
            <button className="popupClose" onClick={this.props.closePopup}>Lukk</button>
          </div>
        </div>
      </div>
    )
  }




  componentDidMount(props){
    this.refs.newPwButton.onclick = () => {
      console.log('button clicked')
      let api_key = 'key-53691f7229e0eec8522473b2e853cabf';
      let domain = 'sandboxb5cedbd4224a4475ac49059ce199712a.mailgun.org';
      let mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
      let Email = this.refs.recipient.value;

      employee.getUserByMail(Email).then((user) => {
        let newPassword = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 8; i++)
        newPassword += possible.charAt(Math.floor(Math.random() * possible.length));
        console.log(Email);
        console.log(newPassword);
        console.log(user);
        console.log(mailgun);
        let hashedPassword = passwordHash.generate(newPassword);
        console.log(hashedPassword);
        var data = {
          from: 'Rode Kors <gruppe23prosjekt@gmail.com>',
          to: Email,
          subject: 'Tilbakestill passord',
          text: 'Hei ' +user.first_name+ '\nDitt nye passord er: ' + newPassword + '\nHvis du ikke har bedt om å få tilsendt nytt passord ber vi deg kontakte en administrator så fort som mulig. \nFor at du ikke skal glemme passordet ditt ber vi om at du går inn på profilsiden din og endrer passordet ditt etter at du har logget inn. \n\nVennlig hilsen oss fra Gruppe 23 teamet.'
        };
        employee.resetPw(hashedPassword, Email).then(() =>{
          console.log(data);
          mailgun.messages().send(data, function (error, body) {
            console.log(body);
          }).catch((error) => {
            console.log(errorMessage);
          })
        })
      })

    }
  }


}



export { LoginWindow }
