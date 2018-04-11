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
import { Forside2, forside2 } from "./forside.js"
import { LoginWindow } from "./loginwindow.js"
import { RegisterWindow } from "./registerwindow.js"
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
//======================================================================================================
//==========Rendering==========================================================================
//======================================================================================================
//ProgramRender er hoved DOM Objektet hvor alle andre DOM objekter blir dynamisk endret ved hjelp av React State.

history.push("/")
class ProgramRender extends React.Component<{}> {
  constructor() {
    super();
}
      render() {
        let signedInUser = employee.getSignedInUser2();
        if(signedInUser) {
          //Vi returnerer enten forsiden, eller login/registrering basert på om en bruker er logget inn.
          // Ved innlogging/utlogging forceupdater vi ProgramREnder til å skjekke JSON filen om vi er logget inn.
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
let programRender: React$Component;
function forside(){
    ReactDOM.render((
        <ProgramRender />
  ), document.getElementById('all'));
}

forside()
export { ProgramRender, programRender, history }
