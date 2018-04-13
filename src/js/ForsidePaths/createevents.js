import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { employee } from "../services"
import { User, userCertificates, ExtContact } from "../services"
import {history} from '../forside';
import {SelectRoleTemplate} from './createeventpopup/RoleTemplatePopup';
let EventFile: LSEventObject;

if (localStorage.getItem("eventFile") === null) {
EventFile = eventObject()
console.log(EventFile)
} else {
    let eventFile = localStorage.getItem("eventFile")
    EventFile = JSON.parse(eventFile)
}

function eventObject(){
  //Oppretter objektet vi bruker til å lagre eventcreation mellom visninger, queries og opprettelse av arrangementer.
  let object = {roles: [],
                  event: {id: "", start: "", end: "", contact_id: "", prep: "", adress: "", gmaps: "", postal: "", title: "", extContact: "", details: ""}
                                }
                                localStorage.setItem("eventFile", JSON.stringify(object))
return object
}

class LSEventObject {
  roles: array;
  event: {id: number, start: datetime, end: datetime, prep: datetime, contact_id: number, adress: string, gmaps: string, postal: number, extContact: string, details: string}
}

class createevents extends React.Component<{}> {
  refs: {
    adress: HTMLInputElement;
    prep: HTMLInputElement;
    start: HTMLInputElement;
    end: HTMLInputElement;
    ExtFirstname: HTMLInputElement;
    Extlastname: HTMLInputElement;
    Exttlf: HTMLInputElement;
    eventname: HTMLInputElement;
    zip: HTMLInputElement;
    details: HTMLInputElement;
    create: HTMLInputElement;
    RKContactPerson: HTMLInputElement;
    addRoleAmount: HTMLInputElement;
    Hostname: HTMLInputElement;
  }
  //React Class for å opprette arrangementer
  constructor(){
    super()
    this.state = {externcontact: "",
                  addroles: "",
                  addedroles: "",
                  contactpersons: "",
                  addedroles: ""}
  }

  togglePopup(): void {
    /* Funksjonen som slår av/på registreringspopup */
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  render() {
 return (
   <div className="full">
     {
       this.state.showPopup
         ? <SelectRoleTemplate text="Close Me" closePopup={this.togglePopup.bind(this)}/>
         : null
     }
   <div className="ce_Row1">
     <section>
     <div className="ec_inputDiv">
       <label htmlFor="Arrangementnavn" className="inputWidth">Arrangementnavn: </label>
       <input ref="eventname" id="Arrangementnavn" defaultValue={EventFile.event.title} type="text"  className="inputWidth" name="Arrangementnavn"/>
     </div>

     <div className="tab">
       <button className="tablinks" onClick={ () =>{ openCity(event, 'extContact')}}>Eksternkontakt</button>
       <button className="tablinks" onClick={()=>{openCity(event, 'newExtContact')}}>Ny eksternkontakt</button>
     </div>

     <div id="extContact" className="tabcontent">
       <div className="ec_inputDiv">
             <label htmlFor="myBrowser" className="inputWidth">
                Velg eksternkontakt:
                <input ref="ExtContactName" defaultValue={EventFile.event.extContact} list="externcontacts" placeholder="Søk gjennom externkontakter" className="inputWidth"name="myBrowser" />
            </label>
            <datalist id="externcontacts">
              {this.state.externcontact}
            </datalist>
          </div>
     </div>

     <div id="newExtContact" className="tabcontent">
       <div className="ec_inputDiv">
         <label htmlFor="Arranger">Fornavn: </label>
            <input ref="ExtFirstname" id="ExtFirstname" type="text"  name="Arranger"/>
       </div>
       <div className="ec_inputDiv">
         <label htmlFor="Arranger">Etternavn: </label>
            <input ref="Extlastname" id="lastname" type="text"  name="Arranger"/>
       </div>
       <div className="ec_inputDiv">
         <label htmlFor="Arranger">Telefonnummer: </label>
            <input ref="Exttlf" id="Exttlf" type="text"  name="Arranger"/>
       </div>
       <button>Opprett</button>
     </div>

     <div className="ec_inputDiv">
       <label htmlFor="Arranger" className="inputWidth">Arrangørnavn: </label>
          <input ref="Hostname" id="Arranger" className="inputWidth" type="text" name="Arranger"/>
     </div>
   </section>

   <div className="ec_inputDiv">
     <label htmlFor="Startdato" className="inputWidth">Startdato: </label>
        <input ref="start" id="Startdato" defaultValue={EventFile.event.start} className="inputWidth" type="datetime-local"  name="Startdato"/>
   </div>

   <div className="ec_inputDiv">
     <label htmlFor="Sluttdato" className="inputWidth">Sluttdato: </label>
        <input ref="end" id="Sluttdato" className="inputWidth" defaultValue={EventFile.event.end} type="datetime-local"  name="Sluttdato"/>
   </div>

   <div className="ec_inputDiv">
     <label  htmlFor="Prep" className="inputWidth">Preparasjon tid: </label>
        <input ref="prep" id="Prep" defaultValue={EventFile.event.prep} className="inputWidth" type="datetime-local"  name="Prep"/>
   </div>

   <div className="ec_inputDiv" className="inputWidth">
      <label htmlFor="myBrowser" className="inputWidth">
         Velg kontaktperson fra Røde Kors:
         <input ref="RKContactPerson" defaultValue={EventFile.event.contact_id}  onInput={(event) => {
           console.log(this.refs.prep.value)
           console.log(this.refs.start.value)
           console.log(this.refs.end.value)
           if(this.refs.start.value == "" || this.refs.end.value == "" || this.refs.prep.value == "") {
             alert("Vennligst sett opp alle datoene på arrangementet før du velger kontaktperson.")
             event.target.value = ""
           }}} list="contactpersons" name="myBrowser" placeholder="Søk etter kontaktpersoner" className="inputWidth" />
     </label>
     <datalist id="contactpersons">
       {this.state.contactpersons}
     </datalist>
   </div>

   <div className="ec_inputDiv">
     <label htmlFor="Adresse" className="inputWidth">Adresse: </label>
        <input ref="adress" defaultValue={EventFile.event.adress} id="Adresse" className="inputWidth" type="text"  name="Prep"/>
   </div>

   <div className="ec_inputDiv">
     <label htmlFor="Postnr" className="inputWidth">Postnummber:: </label>
        <input ref="zip" id="Postnr" defaultValue={EventFile.event.postal}className="inputWidth" type="text"  name="Postnr"/>
   </div>
   <div className="ec_inputDiv">
     <label className="ce_textAreaLabel">Legg til beskrivelse: </label>
     <textarea ref="details" defaultValue={EventFile.event.details} className="ce_textArea"></textarea>
   </div>
     <button ref="create" onClick={()=>{}}className="ec_opprett">Opprett Arrangement</button>
</div>

<div className="ce_Row2">
    <div className="ec_addRoles">
      <div className="ec_inputDiv" className="ec_SelectRole">
        <label htmlFor="myBrowser" className="inputWidth">
            Velg rolle å legge til arrangementet:</label>
            <input ref="addroles" list="addroles" name="myBrowser" placeholder="Søk i roller" className="inputWidth" />
            <datalist ref="addrolesList" id="addroles">
              {this.state.addroles}
            </datalist>
          </div>
          <div className="ec_RoleAmount"><label className="inputWidth">Antall:</label><input ref="addRoleAmount" className="inputWidth" type="number"/></div>
          <div className="ec_RoleAddButtonDiv"><label></label><button onClick={ () => {this.addRoles()}} className="ec_RoleAddButton">Legg til</button></div>
        </div>

        <div className="ec_addedRoles">
          {this.state.addedroles}
        </div>
        <div className="gMaps"></div>
      </div>

<div className="ce_Row3">
  <button ref="cancel" onClick={()=>{this.cancelEventCreation()}} className="Row_3buttons">Avbytt opprettelse</button>
  <button ref="cancel" onClick={()=>{this.cancelEventCreation()}} className="Row_3buttons">Opprett Vakt Template</button>
</div>
</div>)
}

  cancelEventCreation(){
    localStorage.removeItem("eventFile")
    EventFile = ""
    EventFile = eventObject()
    this.forceUpdate()

    this.refs.eventname.value = ""
    this.refs.adress.value = ""
    this.refs.start.value = ""
    this.refs.end.value = ""
    this.refs.prep.value = ""
    this.refs.zip.value = ""
    this.refs.ExtContactName.value = ""
    this.refs.RKContactPerson.value = ""
    this.refs.details.value = ""
  }

  renderRoles(){
    this.setState({
      addedroles: EventFile.roles.map((role) => {if(role != null){console.log("SKJEDDE"); return <div key={role.role_id} className="AddedRolesRow">{role.amount + " skift for ansatte med rollen: " + role.role_name + " er satt opp."}</div>}})
    })
  }

  createRoleTemplate(){
    EventFile.map
  }

  addRoles(){
    employee.getRoleByName(this.refs.addroles.value).then((role) => {
      EventFile.roles[role.role_id] = {role_id: role.role_id, role_name: role.role_name, amount: this.refs.addRoleAmount.value}
      //Med løsningen over får vi ikke duplikate innslag av samme rolle i eventet
      localStorage.setItem("eventFile", JSON.stringify(EventFile))
        console.log(EventFile)
        this.renderRoles()
    })
  }

  saveEventProgress(){
    EventFile.event.title = this.refs.eventname.value
    EventFile.event.adress = this.refs.adress.value
    EventFile.event.start = this.refs.start.value
    EventFile.event.end = this.refs.end.value
    EventFile.event.prep = this.refs.prep.value
    EventFile.event.postal = this.refs.zip.value
    EventFile.event.extContact = this.refs.ExtContactName.value
    EventFile.event.contact_id = this.refs.RKContactPerson.value
    EventFile.event.details = this.refs.details.value
    console.log(EventFile)
    localStorage.setItem("eventFile", JSON.stringify(EventFile))
  }
  loadEventProgress(){
    this.refs.eventname.value = EventFile.event.adress
    this.refs.adress.value = EventFile.event.adress
    this.refs.start.value = EventFile.event.start
    this.refs.end.value = EventFile.event.end
    this.refs.prep.value = EventFile.event.prep
    this.refs.zip.value = EventFile.event.postal
    this.refs.ExtContactName.value = EventFile.event.extContact
    this.refs.RKContactPerson.value = EventFile.event.contact_id
    this.refs.details.value = EventFile.event.details
    console.log("butnuttin happerned")
  }


  componentDidMount(){
    this.renderRoles()
    employee.getExternalContacts().then((extContacts: ExtContact[]) => {
      this.setState({
        externcontact: extContacts.map((extContact) => <option  key={extContact.contact_id} value={extContact.first_name + " " + extContact.last_name} label={extContact.contact_id} />)
      })
    })

    employee.getDistinctRoles().then((roles) => {
      localStorage.setItem("roles", JSON.stringify(roles))
      this.setState({
        addroles: roles.map((role) => <option key={role.role_id} value={role.role_name} label={"r_id: " + role.role_id} />)
      })
    })

  }

  componentWillUnmount() {
    this.saveEventProgress()
    this.setState({
                    externcontact: "",
                    addroles: "",
                    addedroles: "",
                    contactpersons: "",
                    addedroles: ""
    })
  }

}
//Bytte mellom eksternkontakt og ny eksternkontakt
function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
export { createevents }
