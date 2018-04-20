//POPUP I ADMINPAGE som lar admin opprette ny bruker
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import {RegisterWindow} from '../../registerwindow';
import { employee } from '../../services';
import {ShiftCreatePopup} from '../shiftCreatePopup';
import { SCPRef } from "../shiftCreatePopup"
let templateRolesString = []
let templateString =[]
let EventFile;
//@flow
//
// if (localStorage.getItem("eventFile") === null) {
//
// console.log(EventFile)
// } else {
//     let eventFile = localStorage.getItem("eventFile")
//     EventFile = JSON.parse(eventFile)
// }

class SelectRoleTemplate extends React.Component<{}> {
  constructor(props) {
    super(props)
    this.state = {roletemplates: ""}

  }

  render(){
    return(
      <div className="full popup SRT">
        <div className="popup_inner">
          <label className="templateLabel">Velg vakt template</label><p/>
          {this.state.roletemplates}
          <button className="RTClose" onClick={this.props.closePopup}> lukk </button>
        </div>
      </div>
    )
  }

  saveRoles(id, props){
    employee.getTemplateRoles(id).then((roles)=>{
      EventFile = []
      SCPRef.state.roleObject = {roles: []}
      new Promise((resolve, reject) => {
        roles.map((role)=> {
          SCPRef.state.roleObject.roles[role.role_id] = {role_id: role.role_id, role_name: role.role_name, amount: role.amount}
          resolve()
          //Med løsningen over får vi ikke duplikate innslag av samme rolle i eventet
        })
      }).then(()=> {
        this.props.loadTemplate()
        this.props.closePopup()
      })

    })
  }

  renderTemplates(){
    employee.getTemplates().then((templates) => {
      this.setState({roletemplates: templates.map((template) => {
        return <div key={template.template_id}  className="TemplateRolesRow">{template.template_name}<button className="floatRight" onClick={()=>{this.removeTemplate(template.template_id)}}>X</button><button className="floatRight" onClick={()=>{this.saveRoles(template.template_id)}}>Velg</button><div className="templateRoleInfo">{"Beksrivelse: " + template.description}</div></div>
        })
      })
    })
  }

  componentDidMount(){
    console.log(SCPRef)
    this.renderTemplates()

  }

  removeTemplate(id){
    employee.removeTemplate(id).then(()=> {
    this.renderTemplates()
    })
  }
}



export {SelectRoleTemplate}
