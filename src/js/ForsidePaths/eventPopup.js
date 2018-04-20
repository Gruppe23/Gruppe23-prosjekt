// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { employee } from "../services"
import { Map, InfoWindow, Marker, Listing, GoogleApiWrapper } from 'google-maps-react';
import { kalender } from './kalender';
import {SelectRoleTemplate} from './createeventpopup/RoleTemplatePopup';
import onClickOutside from "react-onclickoutside";
import SelectSearch from 'react-select-search'



// export default GoogleApiWrapper({
//   apiKey: ('AIzaSyBBamUPCSbygOz1eTYvLkIWPpajzV8zi38')
// })(MapContainer)







class EventPopup2 extends React.Component<{}> {
  constructor(props){
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  handleClickOutside(props){
    this.props.closePopup()
    console.log("OUTSIDEEE")
  }

  render(){
    let item = localStorage.getItem('event')
    item = JSON.parse(item)
    let signup;
    let admin;
    let user = employee.getSignedInUser2()
    console.log(user)
    console.log(item)
    if (item.employee_id == null && user.user_type != 2 && item.isshift){
      signup = <button onClick={()=> {this.showInterest(user.user_id, item.id)
                                      kalender.RenderCalendar()}}> Vis interesse! </button>
    } else {
      if (user.user_type == 2) {
        admin = <AdminContent shift={item}/>
      }
      signup = ""
    }

//Return when event is clicked on...
    return(
    <div className="popup">
      <div className="popup_inner">
        <div className="full popupContent">
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
          <div ref="mapGoesHere">

          </div>
        </div>
        <div>
            <button className="popupClose" onClick={this.props.closePopup}> Lukk </button>
        </div>
        {admin}
        </div>
      </div>
    </div>
    )
  }
//Letting users show interest in a shift
  showInterest(user, shift_id){
    employee.setInterest(user, shift_id)
    kalender.RenderCalendar();
  }


  componentDidMount(props){
    new Promise((resolve,reject) =>{
        let item = localStorage.getItem('event')
        resolve(JSON.parse(item))
      }).then((event)=> {
        employee.getSignedInUser().then((user)=>{
        if(event.isshift){
          if(user.user_type == 2) {
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

          } else if(event.employee_id == null){
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
        } else {
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
    })
  })
  }
}
//Admin has own rights when selecting events
class AdminContent extends React.Component<{}> {
  constructor(props){
    super(props);
    this.state = {employees: []}
  }

  render(props){
    console.log(this.props.shift)
    return(
    <div className="AdminContentWrap">
      <span>Velg blant tilgjengelige ansatte som kvalifiserer til skiftet: </span>
      <SelectSearch ref="userforRole" name="language" options={this.state.employees} search={true} placeholder="Tildel skift"
        mode="input"
        onBlur={(value)=> {if(value != undefined){this.assignShift(value, this.props.shift.id)}}}
        onChange={(value)=> {if(value != undefined){this.assignShift(value, this.props.shift.id)}}}
       />
       <div className="editTime">
       <span>Endre starttid: </span><input ref="startEdit" type="time"/><span> Endre sluttid: </span><input ref="sluttEdit" type="time"/><button ref="setNyTid">Endre Tid</button>
       </div>
    </div>
  )
  }
//Assign a employee for at specific shift
assignShift(value, shift_id){
  console.log(value.value, shift_id)
  employee.setShiftEmployee(value.value, shift_id).then((x)=>{
    console.log(x)
    kalender.RenderCalendar()
    console.log("Success!")
  })
}
  componentDidMount(){
    employee.getShift(this.props.shift.id).then((shift) => {
      console.log(shift)
      employee.getAvailableUsersWithRole(shift.start, this.props.shift.rolle).then((employees)=>{
        console.log(employees)
        employees.map((x)=>{this.state.employees.push({name: (x.first_name + " " + x.surname), value: x.user_id})})
      })
    })
  }
  componentWillUnmount(){
    this.setState({employees: []})
  }
}

let EventPopup = onClickOutside(EventPopup2)
export {EventPopup}
