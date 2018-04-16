// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { employee } from "../services"
import { Map, InfoWindow, Marker, Listing, GoogleApiWrapper } from 'google-maps-react';

export class MapContainer extends React.Component<{}> {


  render() {
    const style = {
      width: '30vw',
      height: '30vh'
    }
    return (
        <Map
          style={{width: '30vw', height: '30vh'}}
          google={this.props.google}
          initialCenter={{
            lat: 40.854885,
            lng: -88.081807
          }}
          zoom={30}>
        </Map>
    );
  }

  componentDidMount() {
  console.log('bleh');
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyBBamUPCSbygOz1eTYvLkIWPpajzV8zi38')
})(MapContainer)


class EventPopup extends React.Component<{}> {
  constructor(){
    super();

  }
  render(){
    return(
    <div className="popup">
      <div className="popup_inner">
        <div className="event">
          <div ref="eventName"></div>
          <div ref="eventDescription"></div>
          <div ref="eventLocation"></div>
        //  <a href="" ref="eventMapsLink">Google Maps Link</a>
          <div>Ekstern kontakt</div>
          <div ref="contactName"></div>
          <div ref="contactNumber"></div>
          <div id="map_canvas"></div>
        </div>
        <div>
            <button onClick={this.props.closePopup}> Lukk </button>
        </div>
        <div style={{width: '30vw', height: '30vh'}}>
        <MapContainer/>
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
            console.log(contact);
            this.refs.eventName.textContent = event.title
            this.refs.eventLocation.textContent = event.address
            this.refs.contactName.textContent = contact.first_name + ' ' +contact.last_name
            this.refs.contactNumber.textContent = contact.phone_number

            })
    })
  }
}


export { EventPopup }
