import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { employee } from "../services"
import { User, userCertificates } from "../services"
import {history} from '../forside';

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

class createevents extends React.Component<{}> {
  constructor(){
    super()
  }

  render() {
 return (
   <div className="full">
   <div className="ce_Row1">
     <section>
     <div className="ec_inputDiv">
       <label htmlFor="Arrangementnavn" className="extContactSelect">Arrangementnavn: </label>
       <input id="Arrangementnavn" type="text" value="" className="extContactSelect" name="Arrangementnavn"/>
     </div>

     <div className="tab">
       <button className="tablinks" onClick={ () =>{ openCity(event, 'extContact')}}>Eksternkontakt</button>
       <button className="tablinks" onClick={()=>{openCity(event, 'newExtContact')}}>Ny eksternkontakt</button>
     </div>

     <div id="extContact" className="tabcontent">
       <div className="ec_inputDiv">
             <label htmlFor="myBrowser" className="extContactSelect">
                Velg eksternkontakt:
                <input list="browsers" className="extContactSelect"name="myBrowser" />
            </label>
            <datalist id="browsers">
                <option value="Chrome" />
                <option value="Firefox" />
                <option value="Internet Explorer" />
                <option value="Opera" />
                <option value="Safari" />
                <option value="Microsoft Edge" />
            </datalist>
          </div>
     </div>

     <div id="newExtContact" className="tabcontent">
       <div className="ec_inputDiv">
         <label htmlFor="Arranger">Fornavn: </label>
            <input id="Arranger" type="text" value="" name="Arranger"/>
       </div>
       <div className="ec_inputDiv">
         <label htmlFor="Arranger">Etternavn: </label>
            <input id="Arranger" type="text" value="" name="Arranger"/>
       </div>
       <div className="ec_inputDiv">
         <label htmlFor="Arranger">telefonnummer: </label>
            <input id="Arranger" type="text" value="" name="Arranger"/>
       </div>
       <button>Opprett</button>
     </div>

     <div className="ec_inputDiv">
       <label htmlFor="Arranger" className="extContactSelect">Arrangørnavn: </label>
          <input id="Arranger" className="extContactSelect" type="text" value="" name="Arranger"/>
     </div>
   </section>
<div className="ec_inputDiv" className="extContactSelect">
      <label htmlFor="myBrowser" className="extContactSelect">
         Velg kontaktperson fra Røde Kors:
         <input list="browsers" name="myBrowser" className="extContactSelect" />
     </label>
     <datalist id="browsers">
         <option value="Chrome" />
         <option value="Firefox" />
         <option value="Internet Explorer" />
         <option value="Opera" />
         <option value="Safari" />
         <option value="Microsoft Edge" />
     </datalist>
   </div>

   <div className="ec_inputDiv">
     <label htmlFor="Arranger" className="extContactSelect">Startdato: </label>
        <input id="Arranger" className="extContactSelect" type="datetime-local" value="" name="Arranger"/>
   </div>

   <div className="ec_inputDiv">
     <label htmlFor="Arranger" className="extContactSelect">Sluttdato: </label>
        <input id="Arranger" className="extContactSelect" type="datetime-local" value="" name="Arranger"/>
   </div>
</div>
<div className="ce_Row2"></div>
<div className="ce_Row3"></div>
</div>)

  }
  componentDidMount(){
  }
}

export { createevents }
