import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { employee } from "./services"
var passwordHash = require('password-hash');
var hashedPassword = passwordHash.generate('bass32');
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
const history = createHashHistory();

//======================================================================================================
//==========Rendering==========================================================================
//======================================================================================================
//ProgramRender er hoved DOM Objektet hvor alle andre DOM objekter blir dynamisk endret ved hjelp av React State.


class ProgramRender extends React.Component {
  constructor() {
    super(); //Vi binder this.startpage, enkelt forklart lar det oss bruke this.startpage i klassen for å
    this.navigate = this.navigate.bind(this)
}
navigate(path){
    history.push(path);
}
      render() {
        return (
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
        );
      }
      componentDidMount(){

        history.push("/page1")
      }
}

function forside(){
    ReactDOM.render((
        <ProgramRender />
  ), document.getElementById('all'));
}

forside()
