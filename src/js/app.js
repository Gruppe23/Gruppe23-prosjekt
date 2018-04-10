// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { employee } from "./services"
var passwordHash = require('password-hash');
var hashedPassword: string = passwordHash.generate('bass32');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
console.log(hashedPassword)
let loginState;
console.log(window.innerWidth + "Width + Height" + window.innerHeight)
import { Forside2, forside2 } from "./forside.js"
import { LoginWindow } from "./loginwindow.js"
import { RegisterWindow } from "./registerwindow.js"
import createHashHistory from 'history/createHashHistory';
//import {nodemailer} from 'nodemailer';
const history = createHashHistory();
// https://medium.com/@manojsinghnegi/sending-an-email-using-nodemailer-gmail-7cfa0712a799

let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'gruppe23prosjekt@gmail.com',
        pass: 'superl3tt'
    }
});

const mailOptions = {
  from: 'gruppe23prosjekt@gmail.com', // sender address
  to: 'aslak.kh@live.no', // list of receivers
  subject: 'Subject of your email', // Subject line
  html: '<p>Your html here</p>'// plain text body
};

transporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
});

//======================================================================================================
//==========Rendering==========================================================================
//======================================================================================================
//ProgramRender er hoved DOM Objektet hvor alle andre DOM objekter blir dynamisk endret ved hjelp av React State.

class ProgramRender extends React.Component<{}> {
  constructor() {
    super(); //Vi binder this.startpage, enkelt forklart lar det oss bruke this.startpage i klassen for å
}
      render() {

        let signedInUser = employee.getSignedInUser();
        if(signedInUser) {
        return (
          <Forside2 />
        )
      }else{
        return(
          <div id="full">
          <div className="loginContent" id="loginContent">
          <HashRouter>
            <div>
              <Switch>
                <Route exact path='/page1' component={LoginWindow} />
                <Route exact path='/page2' component={RegisterWindow} />
              </Switch>
            </div>
          </HashRouter>
          </div>
          </div>
        )
      }
      }
      componentDidMount(){
        history.push("/page1")
        programRender = this
      }
}
let programRender: Object;
function forside(){
    ReactDOM.render((
        <ProgramRender />
  ), document.getElementById('all'));
}

forside()
export { ProgramRender, programRender, history }
