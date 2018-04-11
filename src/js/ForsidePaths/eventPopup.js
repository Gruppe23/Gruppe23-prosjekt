// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { employee } from "../services"
import { InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export class MapContainer extends React.Component<{}> {
  render() {
    const style = {
      width: '30vw',
      height: '30vh'
    }
    if (!this.props.loaded) {
     return <div>Loading...</div>
   }
    return (
      <div style={style}>
        <Map google={this.props.google}/>
      </div>
    );
  }

  componentDidMount() {
  console.log('bleh');
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyBBamUPCSbygOz1eTYvLkIWPpajzV8zi38')
})(MapContainer)

export class Map extends React.Component<{}> {
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
  }

  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = 14;
      let lat = 37.774929;
      let lng = -122.419416;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(node, mapConfig);
    }
  }

  render() {
    return (
      <div ref='map'>
        Loading map...
      </div>
    )
  }

  componentDidMount() {
   this.loadMap();
 }
}

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

          <a href="" ref="eventMapsLink">Google Maps Link</a>
          <div>Ekstern kontakt</div>
          <div ref="contactName"></div>
          <div ref="contactNumber"></div>
          <div id="map_canvas"></div>
        </div>
        <div>
            <button onClick={this.props.closePopup}> Lukk </button>
        </div>
        <MapContainer/>
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
            this.refs.contactName.textContent = contact.contact_firstName + ' ' +contact.contact_lastName
            this.refs.contactNumber.textContent = contact.phone_number


            })
    })
  }
}


export { EventPopup }
