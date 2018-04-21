import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import SelectSearch from 'react-select-search'
import { employee } from "../services"
import { User, userCertificates, ExtContact } from "../services"
import {history} from '../forside';
import {SelectRoleTemplate} from './createeventpopup/RoleTemplatePopup';
import onClickOutside from "react-onclickoutside";
let EventFile: LSEventObject;
let selectedRole = {};

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
                  event: {id: "", start: "", end: "", contact: {value: "", name: ""}, prep: "", adress: "", gmaps: "", postal: "", title: "", extContact: {value: "", name: ""}, details: "", hostname: ""}
                                }
  localStorage.setItem("eventFile", JSON.stringify(object))
return object
}

class LSEventObject {
  roles: array;
  event: {id: number, start: datetime, end: datetime, prep: datetime, hostname: string, contact_id: number, adress: string, gmaps: string, postal: number, extContact: string, details: string}
}

class createevents extends React.Component<{}> {
  refs: {
    adress: HTMLInputElement;
    prep: HTMLInputElement;
    start: HTMLInputElement;
    end: HTMLInputElement;
    Extfirstname: HTMLInputElement;
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
    this.state = {externcontact: [],
                  addedroles: "",
                  contactpersons: [],
              }
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
         ? <SelectRoleTemplate text="Close Me" closePopup={this.togglePopup.bind(this)}
         loadTemplate={this.renderRoles.bind(this)}/>
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
     <div className="ec_inputDiv" className="inputWidth" ref="contactpersonSelect">
     <SelectSearch ref="RKContactPerson" name="language" options={this.state.externcontact} search={true} placeholder="Velg Kontaktperson"
     mode="input"
     onMount={()=> EventFile.event.extContact}
     onChange={(value)=>{EventFile.event.extContact= value
                    console.log(value)}}
     onHighlight={onHighlight}
     onBlur={(value)=>{EventFile.event.extContact= value
                    console.log(value)}}
     onFocus={onFocus}/>
     </div>
     </div>

     <div id="newExtContact" className="tabcontent">
       <div className="ec_inputDiv">
         <label htmlFor="Arranger">Fornavn: </label>
            <input ref="Extfirstname" id="ExtFirstname" type="text"  name="Arranger"/>
       </div>
       <div className="ec_inputDiv">
         <label htmlFor="Arranger">Etternavn: </label>
            <input ref="Extlastname" id="lastname" type="text"  name="Arranger"/>
       </div>
       <div className="ec_inputDiv">
         <label htmlFor="Arranger">Telefonnummer: </label>
            <input ref="Exttlf" id="Exttlf" type="text"  name="Arranger"/>
       </div>
       <button onClick={() => {this.addNewExtContact()}} >Opprett</button>
     </div>

     <div className="ec_inputDiv">
       <label htmlFor="Arranger" className="inputWidth">Arrangørnavn: </label>
          <input ref="Hostname" id="Arranger" className="inputWidth" type="text" name="Arranger"/>
     </div>
   </section>

   <div className="ec_inputDiv">
     <label htmlFor="Startdato" className="inputWidth">Startdato: </label>
        <input ref="start" id="Startdato" onBlur={this.renderAvailableRKContactPersons.bind(this)} Max="2999-12-31" defaultValue={EventFile.event.start} className="inputWidth" type="datetime-local"  name="Startdato"/>
   </div>

   <div className="ec_inputDiv">
     <label htmlFor="Sluttdato" className="inputWidth">Sluttdato: </label>
        <input ref="end" id="Sluttdato" onBlur={this.renderAvailableRKContactPersons.bind(this)} Max="2999-12-31" className="inputWidth" defaultValue={EventFile.event.end} type="datetime-local"  name="Sluttdato"/>
   </div>

   <div className="ec_inputDiv">
     <label  htmlFor="Prep" className="inputWidth">Preparasjon tid: </label>
        <input ref="prep" onBlur={this.renderAvailableRKContactPersons.bind(this)} id="Prep" Max="2999-12-31" defaultValue={EventFile.event.prep} className="inputWidth" type="datetime-local"  name="Prep"/>
   </div>

   <div className="ec_inputDiv" className="inputWidth" ref="contactpersonSelect">
   <label className="inputWidth">Velg kontaktperson:  <i><h6 className="h6fix">(Alle datoer og tider må velges først)</h6></i></label>
   <SelectSearch ref="RKContacts" name="language" options={this.state.contactpersons} search={true} placeholder="Velg Kontaktperson"
      mode="input"
      onMount={onMount}
      onChange={(value)=>{EventFile.event.contact = value
                      console.log(value)}}
                      onBlur={(value)=>{EventFile.event.contact = value
                                      console.log(value)}}
                                      onFocus={this.renderAvailableRKContactPersons.bind(this)}
                      />
   </div>
</div>
<div className="ce_Row2">
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
    <button ref="create" onClick={()=>{this.eventCreate()}}className="ec_opprett">Opprett Arrangement</button>
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
    this.refs.details.value = ""
  }

  eventCreate(){
    console.log(EventFile)
    if(this.refs.eventname.value.length == 0){
      alert("Vennligst fyll inn et arrangementnavn")
    } else{
      if(this.refs.adress.value.length == 0){
        alert("vennligst fyll inn en adresse")
      } else {
        if(this.refs.start.value.length != 16 || this.refs.end.value.length != 16 || this.refs.prep.value.length != 16){
          alert("Vennligst fyll ut alle datoer!")
        } else {
        if  (this.refs.Hostname.value.length == 0 ) {
          alert("Vennligst fyll inn arrangørnavn!")
        } else {
          if(this.refs.zip.value.length != 4 || isNaN(this.refs.zip.value) == true){
            alert("Postnr må være 4 tall")
          }else {
            if(EventFile.event.contact.value == "" || EventFile.event.extContact.value == ""){
              alert("Vennligst velg begge kontaktpersonene")
            }else {
                    console.log(this.refs.start.value +  " " + this.refs.end.value + " " +this.refs.prep.value + " " +this.refs.eventname.value + " " +this.refs.Hostname.value + " " +this.refs.details.value + " " +this.refs.adress.value + " " +this.refs.zip.value + " " +EventFile.event.contact.value + " " + EventFile.event.extContact.value )
                    console.log(EventFile)
                    employee.createEvent(this.refs.start.value, this.refs.end.value, this.refs.prep.value, this.refs.eventname.value, this.refs.Hostname.value, this.refs.details.value, this.refs.adress.value, this.refs.zip.value, Number(EventFile.event.contact.value), Number(EventFile.event.extContact.value))
           }
          }
        }
        }
      }
    }
  }


  // start, end, prep, title, hostname, description, address, postal, contact_id, ext_contact_id



renderAvailableRKContactPersons(){
    //OnInput er ikke den beste metoden. Men har ikke tid til å lage et alternativ. I teorien ville jeg helst ha laget en funksjon som skjekker om alle datoer er satt inn og så utfører get Employee funksjonen.
    //Eventuelt gjevnlig eller on date-change.

    if(this.refs.start.value.length != 16 || this.refs.end.value.length != 16 || this.refs.prep.value.length != 16) {
      this.state.contactpersons = []
        this.refs.RKContacts.placeholder = "Velg alle datoer og tid."
        this.setState({contactpersons: []})
    }else {
      this.state.contactpersons = []
      employee.getAvailableEmployeesEventCreation(this.refs.prep.value, this.refs.end.value).then((x) => {
      x.map((y) => this.state.contactpersons.push({name: (y.first_name + " " + y.surname), value: y.user_id}))
      this.setState({contactpersons: this.state.contactpersons})
    })
    console.log(this.refs.RKContacts)

  }

}

renderSelect(option) {
    let imgStyle = {
        borderRadius: '50%',
        verticalAlign: 'middle',
        marginRight: 10
    };
    return (<span><img style={imgStyle} width="40" height="40" src={option.photo} /><span>{option.name}</span></span>);
}


  removeRole(roleid){
    console.log(EventFile.roles[roleid])
    EventFile.roles[roleid] = null
    localStorage.setItem("eventFile", JSON.stringify(EventFile))
    this.renderRoles()
  }

  addNewExtContact(){
    if(this.refs.Exttlf.value.length >= 8){
      if(this.refs.Extfirstname.value.length > 2 && this.refs.Extlastname.value.length > 2) {
    employee.newExtContact(this.refs.Extfirstname.value, this.refs.Extlastname.value, this.refs.Exttlf.value)
    this.renderExternalContacts()
    this.refs.Extfirstname.value = ""
    this.refs.Extlastname.value = ""
    this.refs.Exttlf.value = ""
  } else {
    alert("Kontaktperson må ha minst 2 bokstaver i navnet.")
  }
  } else {
    alert("Kan ikke opprette kontakt med ugyldig antall tall i tlfnr")
  }
}

  saveEventProgress(){
    EventFile.event.title = this.refs.eventname.value
    EventFile.event.adress = this.refs.adress.value
    EventFile.event.start = this.refs.start.value
    EventFile.event.end = this.refs.end.value
    EventFile.event.prep = this.refs.prep.value
    EventFile.event.postal = this.refs.zip.value
    EventFile.event.details = this.refs.details.value
    EventFile.event.hostname = this.refs.Hostname.value
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
    this.refs.details.value = EventFile.event.details
    this.refs.Hostname.value = EventFile.event.hostname

  }


  componentDidMount(){
    this.renderExternalContacts()
    this.renderAvailableRKContactPersons()
  }

  renderExternalContacts(){
    employee.getExternalContacts().then((extContacts: ExtContact[]) => {
      this.state.externcontact = []
      extContacts.map((y) => this.state.externcontact.push({name: (y.first_name + " " + y.last_name), value: y.contact_id}))
      this.setState({externcontact: this.state.externcontact})
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

function onMount(value) {
    console.log('Mount', value);
}

function onChange(value, state, props) {
    console.log('Change', value);
}

function onHighlight(value, state, props) {
    console.log('Highlight', value);
}

function onBlur(value, state, props) {
    console.log('Blur', value);
}

function onFocus(value, state, props) {
    console.log('Focus', value);
}
export { createevents }
