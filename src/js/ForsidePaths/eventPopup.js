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
    let item = localStorage.getItem('event')
    item = JSON.parse(item)
    let signup
    if (item.employee_id == null){
      signup = <button> Vis interesse! </button>
    } else {
      signup = ""
    }
    return(
    <div className="popup">
      <div className="popup_inner">
        <div className="event">
          <div ref="eventName"></div>
          <div ref="eventDescription"></div>
          <div ref="eventLocation"></div>
          <div ref="startTime"></div>
          <div ref="endTime"></div>
          <h4><div>Røde Kors Kontaktperson</div></h4>
          <div ref="RKC_name"></div>
          <div ref="RKC_tlf"></div>
        //  <a href="" ref="eventMapsLink">Google Maps Link</a>
          <h4><div>Arrangørfirma kontaktperson</div></h4>
          <div ref="contactName"></div>
          <div ref="contactNumber"></div>
          <div id="map_canvas"></div>
          {signup}
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
        if(event.isshift){
          if(event.employee_id == null){
            console.log(event)
            let start = new Date(event.start)
            let end = new Date(event.end)
            let txtStart = String(start.toTimeString()).split(":")
            let txtEnd = String(end.toTimeString()).split(":")
            console.log(start)
            this.refs.eventName.textContent = "Shifttittel: " + event.title;
            this.refs.eventLocation.textContent  = "Adresse: " + event.address;
            this.refs.startTime.textContent = "Starttid: " + txtStart[0] + ":" +  txtStart[1]
            this.refs.endTime.textContent = "Sluttid: " + txtEnd[0] + ":" + txtEnd[1]
            this.refs.contactName.textContent = "Navn: " + event.ext_contact_name + ' ' + event.contact_last_name
            this.refs.contactNumber.textContent = "TLF: " + event.ec_tlf
            this.refs.RKC_name.textContent = "Navn: " + event.contact_first_name + " " + event.contact_last_name
            this.refs.RKC_tlf.textContent = "TLF: " + event.contact_tlf
          }
          console.log(event)
          let start = new Date(event.start)
          let end = new Date(event.end)
          let txtStart = String(start.toTimeString()).split(":")
          let txtEnd = String(end.toTimeString()).split(":")


          console.log(start)
          this.refs.eventName.textContent = "Shifttittel: " + event.title;
          this.refs.eventLocation.textContent  = "Adresse: " + event.address;
          this.refs.startTime.textContent = "Starttid: " + txtStart[0] + ":" +  txtStart[1]
          this.refs.endTime.textContent = "Sluttid: " + txtEnd[0] + ":" + txtEnd[1]
          this.refs.contactName.textContent = "Navn: " + event.ext_contact_name + ' ' + event.contact_last_name
          this.refs.contactNumber.textContent = "TLF: " + event.ec_tlf
          this.refs.RKC_name.textContent = "Navn: " + event.contact_first_name + " " + event.contact_last_name
          this.refs.RKC_tlf.textContent = "TLF: " + event.contact_tlf

        } else {
          console.log("hue")
          employee.getExtContact(event.contact_id).then((contact) => {
            console.log(event);
            console.log(contact);
            this.refs.eventName.textContent = event.title
            this.refs.eventLocation.textContent = "Adresse: " + event.address
            this.refs.contactName.textContent = "Navn: " + contact.first_name + ' ' + contact.last_name
            this.refs.contactNumber.textContent = "tlf: " + contact.phone_number

            })
          }
    })
  }
}


export { EventPopup }
