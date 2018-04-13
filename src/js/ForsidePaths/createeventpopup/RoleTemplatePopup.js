//POPUP I ADMINPAGE som lar admin opprette ny bruker
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import {RegisterWindow} from '../../registerwindow';
import { employee } from '../../services';
let templateRolesString = []
let templateString =[]
let EventFile;
//@flow

if (localStorage.getItem("eventFile") === null) {
EventFile = eventObject()
console.log(EventFile)
} else {
    let eventFile = localStorage.getItem("eventFile")
    EventFile = JSON.parse(eventFile)
}

class SelectRoleTemplate extends React.Component<{}> {
  constructor(props) {
    super(props)
    this.state = {roletemplates: ""}
  }

  render(){
    return(
      <div className="full popup">
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
      EventFile.roles = []
      new Promise((resolve, reject) => {
        roles.map((role)=> {
          EventFile.roles[role.role_id] = {role_id: role.role_id, role_name: role.role_name, amount: role.amount}
          localStorage.setItem("eventFile", JSON.stringify(EventFile))
          console.log(EventFile)
          resolve()
          //Med løsningen over får vi ikke duplikate innslag av samme rolle i eventet
        })
      }).then(()=> {
        this.props.loadTemplate()
        this.props.closePopup()
      })

    })
  }

  componentDidMount(){
    employee.getTemplates().then((templates) => {
      this.setState({templateString, roletemplates: templates.map((template) => {
        let returnDiv = <div key={template.template_id} onClick={()=>{this.saveRoles(template.template_id)}} className="TemplateRolesRow">{template.template_name}<div className="templateRoleInfo">{"Beksrivelse: " + template.description}</div></div>
        return returnDiv
        })
      })

    })
  }
}

export {SelectRoleTemplate}
