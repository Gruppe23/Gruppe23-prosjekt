// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AdminPageUserCreate } from "./AdminPage/AdminPageUserCreate.js"
import { employee } from "../services"


class AdminPage extends React.Component<{}> {
  constructor() {
    super()
    this.state = {userinfo: <div></div>,
                  showPopup: false}

  }
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  render(){

    return(
      <div className="AdminPage_Container">
      <div className="container-fluid hundre">
        {this.state.showPopup ?
<AdminPageUserCreate
  text="Close Me"
  closePopup={this.togglePopup.bind(this)}
/>
:null
}

      <div className="input-group-sm hundre" id="AdminPage_LeftBox">

      <button id="Create Profile" onClick={this.togglePopup.bind(this)}>Oprrett Brukerprofil </button>

      </div>
      <div id="AdminPage_RightBox" className="grey hundre">
        <div id="AcceptUsersBox">
        </div>
      </div>
      </div>
      </div>
    )

  }
  componentDidMount () {

  }
}

export { AdminPage }
