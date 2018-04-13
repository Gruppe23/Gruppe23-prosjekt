//POPUP I ADMINPAGE som lar admin opprette ny bruker
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import {RegisterWindow} from '../../registerwindow';
import { employee } from '../../services';


class SelectRoleTemplate extends React.Component<{}> {
  constructor() {
    super()
  }

  render(){
    return(
      <div className="full"></div>
    )
  }
}

export {SelectRoleTemplate}
