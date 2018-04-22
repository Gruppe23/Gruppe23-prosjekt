// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { employee } from "../../services"
import { Map, InfoWindow, Marker, Listing, GoogleApiWrapper } from 'google-maps-react';
import { kalender, Kalender } from '../kalender';
import {SelectRoleTemplate} from './RoleTemplatePopup';
import onClickOutside from "react-onclickoutside";
import SelectSearch from 'react-select-search'



// export default GoogleApiWrapper({
//   apiKey: ('AIzaSyBBamUPCSbygOz1eTYvLkIWPpajzV8zi38')
// })(MapContainer)






let popp;
class EventPopup2 extends React.Component<{}> {
  constructor(props){
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this)
    popp = this

  }

  handleClickOutside(props){
    this.props.closePopup()
  }

  render(){
    let item = kalender.state.popupinfo
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
        admin = <AdminContent closePopup={this.props.closePopup} updateCalendar={this.props.updateCalendar} shift={item}/>
      }
      signup = ""
    }


    return(
    <div className="popup">
      <div className="popup_inner">
        <div className="popupContent">
        <div className="event">
          <div ref="eventName"></div>
          <div ref="eventDescription"></div>
          <div ref="eventLocation"></div>
          <div id="startTime" ref="startTime"></div>
          <div id="endTime" ref="endTime"></div>
          <h4><div>Røde Kors Kontaktperson</div></h4>
          <div ref="RKC_name"></div>
          <div ref="RKC_tlf"></div>
        //  <a href="" ref="eventMapsLink">Google Maps Link</a>
          <h4><div>Arrangørfirma kontaktperson</div></h4>
          <div ref="contactName"></div>
          <div ref="contactNumber"></div>
          <div id="map_canvas"></div>
          <h4><div ref="emp_title"></div></h4>
          <div ref="emp_name"></div>
          <div ref="emp_tlf"></div>
          <div ref="emp_mail"></div>
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

  showInterest(user, shift_id){
    employee.setInterest(user, shift_id)
    kalender.RenderCalendar();
  }

  componentDidMount(props){
    popp = this
    new Promise((resolve,reject) =>{
        let item = kalender.state.popupinfo
        resolve(item)
      }).then((event)=> {
        employee.getSignedInUser().then((user)=>{
        if(event.isshift != undefined){
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
            if(event.employee_id != null) {
              employee.getEmployee(event.employee_id).then((employee)=>{
                this.refs.emp_title.textContent = "Skifttaker: "
                this.refs.emp_name.textContent = "Navn: " + employee.first_name + " " + employee.surname
                this.refs.emp_mail.textContent = "E-Mail: " + employee.email
                this.refs.emp_tlf.textContent = "TLF: " + employee.tlf
              })
            }
        } else {
            let start = new Date(event.start)
            let end = new Date(event.end)
            this.refs.eventName.textContent = "Arrangsjemangstittel: " + event.title;
            this.refs.eventLocation.textContent  = "Adresse: " + event.address;
            this.refs.startTime.textContent = "Start: " + start
            this.refs.endTime.textContent = "Slutt: " + end
            this.refs.contactName.textContent = "Navn: " + event.ext_contact_name + ' ' + event.contact_last_name
            this.refs.contactNumber.textContent = "TLF: " + event.ec_tlf
            this.refs.RKC_name.textContent = "Navn: " + event.contact_first_name + " " + event.contact_last_name
            this.refs.RKC_tlf.textContent = "TLF: " + event.contact_tlf
            this.refs.emp_name = ""

          }
    })
  })
  }
}

class AdminContent extends React.Component<{}> {
  constructor(props){
    super(props);
    this.state = {employees: []}
  }

  render(props){
    let ShiftContent;
    if(this.props.shift.isshift != undefined){
      ShiftContent =   <div>
      <span>Velg blant tilgjengelige ansatte som kvalifiserer til skiftet: </span>
                        <SelectSearch ref="userforRole" name="language" options={this.state.employees} search={true} placeholder="Tildel skift"
                          mode="input"
                          onBlur={(value)=> {if(value != undefined){this.assignShift(value, this.props.shift.id)}}}
                          onChange={(value)=> {if(value != undefined){this.assignShift(value, this.props.shift.id)}}}
                        />
                        <div ref="tilbakemelding"></div>
                        <div className="editTime">
                          <span>Endre starttid: </span><input ref="startEdit" type="time"/><span> Endre sluttid: </span><input ref="sluttEdit" type="time"/><button onClick={()=>{this.editShiftTime()}} ref="setNyTid">Endre Tid</button>
                        </div>
                      </div>

    }
    console.log(this.props.shift)

    return(
    <div className="AdminContentWrap">
      {ShiftContent}
      <button ref="disableBTN" onClick={()=> {this.deleteShift()}}></button>
    </div>
  )
  }

  assignShift(value, shift_id){
    console.log(value.value, shift_id)
    employee.setShiftEmployee(value.value, shift_id).then((x)=>{
      this.refs.tilbakemending.innerHTML = value.name + " har blitt satt til skiftet!"
      console.log(x)
      kalender.RenderCalendar()
      console.log("Success!")
    })
  }

  editShiftTime(){
    console.log(this.refs.startEdit.value.split(":"))
    console.log(this.refs.sluttEdit.value)
    console.log(kalender.state.popupinfo.start)
    let shiftStartTime = this.refs.startEdit.value.split(":")
    let shiftEndTime = this.refs.sluttEdit.value.split(":")
    console.log(shiftStartTime)
    kalender.state.popupinfo.start.setHours(shiftStartTime[0], shiftStartTime[1])
    kalender.state.popupinfo.end.setHours(shiftEndTime[0], shiftEndTime[1])

    employee.updateShiftTime(kalender.state.popupinfo.start, kalender.state.popupinfo.end, kalender.state.popupinfo.id).then(()=>{
      let txtStart = kalender.state.popupinfo.start.toTimeString().split(":")
      let txtEnd = kalender.state.popupinfo.end.toTimeString().split(":")
      popp.refs.startTime.textContent = "Starttid: " + txtStart[0] + ":" +  txtStart[1]
      popp.refs.endTime.textContent = "Sluttid: " + txtEnd[0] + ":" + txtEnd[1]
  })}

  deleteShift(props){
    let today = new Date()
    today.setDate(today.getDate() + 14)
    if (kalender.state.popupinfo.start <= today ){
      alert("Du kan ikke slette shift eller arrangement som allerede har skjedd eller skjer snart!")
    } else {
        if(kalender.state.popupinfo.isshift != undefined){
          let confirmed = confirm("Vil du fjerne dette skiftet?")
          if(confirmed = true){
          employee.deleteShift(kalender.state.popupinfo.id).then(()=> {
            this.props.closePopup()
            this.props.updateCalendar()

          })
        }
      } else {
        let confirmed = confirm("Vil du fjerne dette arrangementet?")
        if(confirmed = true){
          employee.deleteEvent(kalender.state.popupinfo.id).then(()=>{
            this.props.closePopup()
            this.props.updateCalendar()
          })
      }
    }
  }
  }

  componentDidMount(props){
    let disableBTNType;
    if(this.props.shift.isshift != undefined) {
      this.refs.disableBTN.textContent = "Fjern Skift"
    } else {
      this.refs.disableBTN.textContent = "Fjern Arrangement"
    }
    employee.getShift(this.props.shift.id).then((shift) => {
      employee.getInterestedAvailableUsersWithRole(shift.start, shift.role_id, shift.shift_id).then((employees)=>{
        console.log(employees)
        employees.map((x)=>{this.state.employees.push({name: (x.first_name + " " + x.surname + " - " + x.shiftscore), value: x.user_id})
      })
    })
      employee.getUninterestedAvailableUsersWithRole(shift.start, shift.role_id, shift.shift_id).then((employees)=>{
        console.log(employees)
        employees.map((y)=>{this.state.employees.push({name: (y.first_name + " " + y.surname + " - " + y.shiftscore), value: y.user_id})})
      })
    }).then(()=>{
      this.setState({employee: this.state.employees})
    })

  }
  componentWillUnmount(){
    this.setState({employees: []})
    kalender.state.popupinfo = null
  }
}

let EventPopup = onClickOutside(EventPopup2)
export {EventPopup}
