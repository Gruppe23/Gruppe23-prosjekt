import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { employee } from "../services"
import { Map, InfoWindow, Marker, Listing, GoogleApiWrapper } from 'google-maps-react';
import { kalender } from './kalender';
import {SelectRoleTemplate} from './createeventpopup/RoleTemplatePopup';
import onClickOutside from "react-onclickoutside";
import SelectSearch from 'react-select-search'
let selectedRole;
let selectedEvent = {value: null, name: null}
let roleObject = {roles: []}
let SCPRef;

export class ShiftCreatePopup extends React.Component<{}> {
  constructor(props){
    super(props)
    SCPRef = this
    let info = this.props.info
    console.log(this.props.info.start.toLocaleTimeString().split(" "))
    console.log(this.props.info)
    this.state ={
      addroles: [],
      renderedRoles: "",
      showPopup: false,
      roleObject: {roles: []},
      availableEvents: []
    }
  }

  render(){
    let startRender = this.props.info.start.toTimeString().split(":")
    let endRender = this.props.info.end.toTimeString().split(":")
    console.log(startRender)
    if(startRender[0].length == 1){
      startRender[0]= 0+startRender[0]
    }
    if(endRender[0].length == 1){
      endRender[0] = 0+endRender[0]
    }
    return(
      <div className="popup">
      {
        this.state.showPopup
          ? <SelectRoleTemplate text="Close Me" closePopup={this.togglePopup.bind(this)}
          loadTemplate={this.renderRoles.bind(this)}/>
          : null
      }
        <div className="popup_inner SCPPopup">
        <div className="all">
          <div className="SCPRow1">
            <span> Start Tid:
            <input ref="SCPStart" defaultValue={startRender[0] + ":" + startRender[1]} type="time"/></span>
            <span> Slutt Tid:
            <input ref="SCPEnd" defaultValue={endRender[0] + ":" + endRender[1]} type="time"/></span>
            <div className="SelectSearchContainer">
            <SelectSearch ref="roleadd" name="language" options={this.state.availableEvents} search={true} placeholder="Velg arrangement skiftet hører til" mode="input"
              onChange={(value)=>{selectedEvent = value
                console.log(value)}}
              onBlur={(value)=>{selectedEvent = value
                  console.log(value)}}
              />
              </div>
              <button ref="create" onClick={()=>{this.createShift()}}className="ec_opprett">Opprett Arrangement</button>
          </div>

          <div className="SCPRow2">
            <div className="SCPRoleAddMenu">
            <span> Velg roller å opprette shift for i valgt tidsperiode:
              <div className="SelectSearchContainer">
              <SelectSearch id ref="roleadd" name="language" options={this.state.addroles} search={true} placeholder="Velg roller å legge til" mode="input"
                onChange={(value)=>{selectedRole = value
                  console.log(value)}}
                onBlur={(value)=>{selectedRole = value
                    console.log(value)}}
                />
              </div>
              <input id="SCPAddRoleAmount" ref="SCPAddRoleAmount" defaultValue={3} type="number"/>
              <button ref="SCPAddRoleAmount" onClick={()=>{this.addRole()}}className="SPCAddRoleBTN">Legg til rolle</button>
              </span>
            </div>
            <div className="SCPRow2RolePresent">
              {this.state.renderedRoles}
            </div>
          </div>
          <div className="ce_Row3">
            <label>Opprett ny Mal</label>
            <input type="text" ref="templatename" placeholder="Mal Navn" className="Row_3Input"/>
            <textarea ref="templatedesc" defaultValue={""} className="ce_textArea"></textarea>
            <button ref="cancel" onClick={()=>{this.createRoleTemplate()}} className="Row_3buttons">Opprett Vakt Mal</button>
            <button ref="cancel" onClick={()=>{this.togglePopup()}} className="Row_3buttons">Velg Vakt Mal</button>
          </div>
          </div>
      <button className="SCPLuck" onClick={this.props.closePopup}>Lukk </button>
    </div>
    </div>
    )
  }
//
  togglePopup(props): void {
    /* Funksjonen som slår av/på registreringspopup */
    console.log(SCPRef)
    this.setState({
      showPopup: !this.state.showPopup
    });

    }

  createShift(props){
    let startDate = new Date(this.props.info.start)
    let endDate = new Date(this.props.info.end)
    let startHours = this.refs.SCPStart.value.split(":")
    let endHours = this.refs.SCPEnd.value.split(":")
    startDate.setHours(startHours[0], startHours[1])
    endDate.setHours(endHours[0], endHours[1])
    console.log(SCPRef.state.roleObject)
    console.log(startHours)
    console.log(endHours)
    console.log(startDate)
    console.log(endDate)
    if(selectedEvent.value != undefined){
    for (let x in SCPRef.state.roleObject.roles) {
      if(SCPRef.state.roleObject.roles[x] != null){
        let z = 0;
          let y = 0;
          while (y < SCPRef.state.roleObject.roles[x].amount){
            y++

              employee.createShift(selectedEvent.value, SCPRef.state.roleObject.roles[x].role_id, startDate, endDate, SCPRef.state.roleObject.roles[x].role_name)
      }
    }
    this.props.updateCalendar()
    this.props.closePopup()
}}}




  addRole(){
    let startDate = new Date(this.props.info.start)
    let endDate = new Date(this.props.info.end)
    let inputStart = this.refs.SCPStart.value.split(":")
    let inputEnd = this.refs.SCPEnd.value.split(":")
    console.log(inputStart)
    startDate.setHours(inputStart[0], inputStart[1])
    console.log(this.refs.SCPStart.value)
    console.log(startDate)
    if(document.getElementById("SCPAddRoleAmount").value < 1){
      alert("Vennligst legg til en eller flere av rollen.")
    } else {
    employee.getRole(selectedRole.value).then((role) => {
      SCPRef.state.roleObject.roles[role.role_id] = {role_id: role.role_id, role_name: role.role_name, amount: document.getElementById("SCPAddRoleAmount").value}
      //Med løsningen over får vi ikke duplikate innslag av samme rolle i eventet
      this.renderRoles()
    })
    }
  }

  renderRoles(){
    this.setState({
      renderedRoles: SCPRef.state.roleObject.roles.map((role) => {if(role != null){console.log("SKJEDDE"); return <div key={role.role_id} className="AddedRolesRow">{role.amount + " skift for ansatte med rollen: " + role.role_name + " er satt opp."} <button onClick={ () => { this.removeRole(role.role_id)} } className="removeShift">X</button></div>}})
    })
  }

  removeRole(roleid){
    console.log(SCPRef.state.roleObject.roles[roleid])
    SCPRef.state.roleObject.roles[roleid] = null
    this.renderRoles()
  }

  createRoleTemplate(){
    employee.createTemplate(this.refs.templatename.value, this.refs.templatedesc.value).then((template) => {
      console.log(template)
      SCPRef.state.roleObject.roles.map((role) => {
        if (role != null) {employee.addRolesToTemplate(template.insertId, role.role_id, role.amount)}
      })
    })
  }

  renderTemplate(){
  let roleJSON = localStorage.getItem("roleObject")
    this.setState({
      renderedRoles: SCPRef.state.roleObject.roles.map((role) => {if(role != null){console.log("SKJEDDE"); return <div key={role.role_id} className="AddedRolesRow">{role.amount + " skift for ansatte med rollen: " + role.role_name + " er satt opp."} <button onClick={ () => { this.removeRole(role.role_id)} } className="removeShift">X</button></div>}})
    })
  }

  renderAvailableEvents(){
    this.state.availableEvents = []
    console.log(this.props.info.start)
    employee.getEventsAvailable(this.props.info.start).then((events)=>{
      events.map((event) => this.state.availableEvents.push({name: event.title, value: event.id}))
    })
    this.setState({availableEvents: this.state.availableEvents})
  }

  componentDidMount(){
    SCPRef = this
    this.refs.SCPAddRoleAmount.onClick = () => {
      this.addRole()
    }
    employee.getDistinctRoles().then((roles)=>{
      roles.map((x) => this.state.addroles.push({name: x.role_name, value: x.role_id}))
    })
    this.renderAvailableEvents()

  }

  componentWillUnmount(){
    SCPRef.state.roleObject = {roles: []}
    roleObject = {roles: []}
    selectedEvent = {value: null, name: null}
    this.setState({
      addroles: [],
      renderedRoles: "",
      availableEvents: ""
    })
  }
}

export {SCPRef}
