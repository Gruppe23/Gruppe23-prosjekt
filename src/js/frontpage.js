import React from 'react';
import ReactDOM from 'react-dom';

class FrontPage extends React.Component {
  render(){
    return (
      <div className="full">
        <div id="taskbar">
          <button ref="forsidebutton">
          Forside
          </button>
          <button ref="kalenderbutton">
          kalender
          </button>
          <button ref="brukeroversikt">
          Brukeroversikt
          </button>
          <button id="logoutBTN" onClick={this.props.logout}>Logout</button>
        </div>
        <div id="root">
          <span className="overskrift">Velkommen til Forsiden!</span>
          <button> Gå tilbake til testside </button>
        </div>
      </div>
    )
  }
}

module.exports.FrontPage
