import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { employee } from "../services"
import { User, userCertificates } from "../services"
import {history} from '../forside';

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
       <label htmlFor="Arrangementnavn">Arrangementnavn: </label>
       <input id="Arrangementnavn" type="text" value="" name="Arrangementnavn"/>
     </div>

     <div className="ec_inputDiv">
       <label htmlFor="Arranger">Arrangør: </label>
       <input id="Arranger" type="text" value="" name="Arranger"/>
     </div>
   </section>
<div className="ec_inputDiv">
      <label htmlFor="myBrowser">
         Choose a browser from this list:
         <input list="browsers" name="myBrowser" />
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
<div className="ce_Row2"></div>
<div className="ce_Row3"></div>
</div>)

  }
  componentDidMount(){
  }
}

export { createevents }
