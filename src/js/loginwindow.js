var passwordHash = require('password-hash');
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { employee } from "./services"
import { forside2 } from "./forside.js"

class LoginWindow extends React.Component {
  constructor(){
    super();
  }

  render() {
    return(
      <div className="login">
            <div className="loginelements">
                <span>Login<p></p></span>
                <input type="text" id="loginMail"></input><p></p>
                <span>Password<p></p></span>
                <input type="password" id="loginPassword"></input><p></p>
                <button ref="login">Login</button>
                <p></p>
                <button onClick={forside2}>Til forsiden</button>
                <p></p>
                <button><Link to='/page2'>Til Registrering</Link></button>
            </div>
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
          localStorage.removeItem('signedInUser')
          localStorage.setItem('signedInUser', JSON.stringify(notes[0]))
          forside2()
        } else {
          alert("password does not match")
        }
    }).catch((error) => {
      console.log('Error getting notes: ' + error);
    });
  }

  };
}
export { LoginWindow }
