// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { employee } from "../services"

class EventPopup extends React.Component<{}> {
  constructor(){
    super();

  }
  render(){
    return(
    <div className="popup">
      <div className="popup_inner">
        <div className="event">
          <div ref="eventInfo"></div>
          <div ref="contactInfo"></div>
        </div>
        <div>
            <button onClick={this.props.closePopup}> Lukk </button>
        </div>
      </div>
    </div>
    )
  }


  componentDidMount(props){
    new Promise((resolve,reject) =>{
        let item = localStorage.getItem('event')
        resolve(JSON.parse(item))
      }).then((event)=> {
          employee.getExtContact(event.contact_id).then((contact) => {
            console.log(event);
        })
    })
  }
}


export { EventPopup }
