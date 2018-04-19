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
let roleObject = {roles: []}
export class ShiftCreatePopup extends React.Component<{}> {
  constructor(props){
    super(props)
    console.log(this.props.info.start.toLocaleTimeString().split(" "))
    console.log(this.props.info)
    this.state ={
      addroles: [],
      renderedRoles: ""
    }
  }

  render(){
    return(
      <div className="popup">
        <div className="popup_inner SCPPopup">
        <div className="all">
          <div className="SCPRow1">
            <span> Start Tid:
            <input ref="SCPStart" defaultValue={this.props.info.start.toLocaleTimeString().split(" ")} type="time"/></span>
            <span> Slutt Tid:
            <input ref="SCPEnd" defaultValue={this.props.info.end.toLocaleTimeString().split(" ")} type="time"/></span>
          </div>

          <div className="SCPRow2">
            <div className="SCPRoleAddMenu">
            <span> Velg roller å opprette shift for valgt tidsperiode:
              <div id="SelectSearchContainer">
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
          </div>
      <button className="SCPLuck" onClick={this.props.closePopup}>Lukk </button>
    </div>
    </div>
    )
  }

  createShift(){
    let startDate = new Date(this.props.info.start)
    let endDate = new Date(this.props.info.end)
    console.log(startDate)
    startDate.setHours(this.refs.SCPStart.value)
    console.log(startDate)
    endDate.setHours(this.refs.SCPEnd.value)
    for (let x in roleObject.roles) {
      if(roleObject.roles[x] != null){
        let z = 0;
          let y = 0;
          while (y < objectRoles.roles[x].amount){
            y++
            console.log(shiftDate)
            console.log(shiftEnd)
        //    employee.createShift(*EVENT_ID,  objectRole.roles[x].role_id, this.refs.SCPStart.value, this.end.value, EventFile.roles[x].role_name)
        }
      }
    }
}


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
      roleObject.roles[role.role_id] = {role_id: role.role_id, role_name: role.role_name, amount: document.getElementById("SCPAddRoleAmount").value}
      //Med løsningen over får vi ikke duplikate innslag av samme rolle i eventet
      this.renderRoles()
    })
    }
  }

  renderRoles(){
    this.setState({
      renderedRoles: roleObject.roles.map((role) => {if(role != null){console.log("SKJEDDE"); return <div key={role.role_id} className="AddedRolesRow">{role.amount + " skift for ansatte med rollen: " + role.role_name + " er satt opp."} <button onClick={ () => { this.removeRole(role.role_id)} } className="removeShift">X</button></div>}})
    })
  }

  removeRole(roleid){
    console.log(roleObject.roles[roleid])
    roleObject.roles[roleid] = null
    this.renderRoles()
  }

  componentDidMount(){
    this.refs.SCPAddRoleAmount.onClick = () => {
      this.addRole()
    }
    employee.getDistinctRoles().then((roles)=>{
      roles.map((x) => this.state.addroles.push({name: x.role_name, value: x.role_id}))
    })
  }
  componentWillUnmount(){
    roleObject = {roles: []}
    this.setState({
      addroles: [],
      renderedRoles: ""
    })
  }
}
