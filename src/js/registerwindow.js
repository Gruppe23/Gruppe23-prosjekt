import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { employee } from "./services"

class RegisterWindow extends React.Component {
  render() {
    return(
            <div className="registerelements">
                <span>Fornavn: </span> <input type="text" id="registerFirstName"></input><p></p>
                <span>Etternavn: </span> <input type="text" id="registerFirstName"></input><p></p>
                <span>Mail: </span> <input type="text" id="registerMail"></input><p></p>
                <span>Passord: </span> <input type="password" id="registerPassword"></input><p></p>
                <span>Passord Controll: </span> <input type="password" id="registerControllPassword"></input><p></p>
                <button><Link to='/page1'>Tilbake til login</Link></button>  <button>Registrer</button>
                <p></p>
            </div>
    )
  }

  componentDidMount(){
  }
}

export { RegisterWindow }
