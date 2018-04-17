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

  renderTemplates(){
    employee.getTemplates().then((templates) => {
      this.setState({roletemplates: templates.map((template) => {
        return <div key={template.template_id}  className="TemplateRolesRow">{template.template_name}<button className="floatRight" onClick={()=>{this.removeTemplate(template.template_id)}}>X</button><button className="floatRight" onClick={()=>{this.saveRoles(template.template_id)}}>Velg</button><div className="templateRoleInfo">{"Beksrivelse: " + template.description}</div></div>
        })
      })

    })
  }

  componentDidMount(){
    this.renderTemplates()
  }

  removeTemplate(id){
    employee.removeTemplate(id).then(()=> {
    this.renderTemplates()
    })
  }
}


function eventObject(){
  //Oppretter objektet vi bruker til å lagre eventcreation mellom visninger, queries og opprettelse av arrangementer.
  let object = {roles: [],
                  event: {id: "", start: "", end: "", contact_id: "", prep: "", adress: "", gmaps: "", postal: "", title: "", extContact: "", details: "", hostname: ""}
                                }
  localStorage.setItem("eventFile", JSON.stringify(object))
return object
}

export {SelectRoleTemplate}
