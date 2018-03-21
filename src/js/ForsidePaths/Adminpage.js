// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AdminPageUserCreate } from "./AdminPage/AdminPageUserCreate.js"
import { employee } from "../services"
import { User } from "../services"
import ReactTooltip from 'react-tooltip'

let reglist;
let licenselist;

type State = {
  userinfo: React.Component[],
  showPopup: Boolean,

}
class AdminPage extends React.Component<State> {
  refs: {
    RegSearch: HTMLInputElement,
    LicSearch: HTMLInputElement,
    LicenseList: HTMLElement,
    UsersList: HTMLElement
  }
  constructor() {
    super()
    this.state = {userinfo: <div></div>,
                  showPopup: false,
                  RegisterList:"",
                  LicenseList: "",
                  userInfo: ""}

  }

  togglePopup(): void {
    {/* Funksjonen som slår av/på registreringspopup*/}
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  render(){
    return(
      <div className="container-fluid AdminPage_Container">
        {this.state.showPopup ?
          <AdminPageUserCreate
          text="Close Me"
          closePopup={this.togglePopup.bind(this)}
          />
          :null
        }

      <div className="input-group-sm hundre" id="AdminPage_LeftBox">
          <button className="btn btn-default" id="Create Profile" onClick={this.togglePopup.bind(this)}>Oprrett Brukerprofil </button>
      </div>
      <div id="AdminPage_RightBox" className="grey hundre">
          <span>Nye registrerte brukere.</span>
          {// Vi oppretter boksen for å akseptere nye brukere til appen. Vi må bruke state for selecten  fordi det er et element som skal oppdateres dynamisk
          //med det vi søker etter.
        }
          <div id="AcceptUsersBox">
          <input type="text" className="regSearch" ref="RegSearch" onKeyUp={this.SearchRegFilter.bind(this)} placeholder="Search for names.." />
            <ul ref="UsersList" className="myUL">
              {this.state.RegisterList}
            </ul>
          </div>
              <span>Nye kvalifikasjoner trenger godkjenning</span>
              {//Vi gjør det samme med LicenseBox,
              }
              <div id="AcceptLicenseBox">
              <input type="text" className="licSearch" ref="LicSearch" onKeyUp={this.SearchLicFilter.bind(this)} placeholder="Search for names or licenses"/>
              <ul ref="LicenseList" className="myUL">
                  {this.state.LicenseList}
              </ul>
              </div>

              <div id="UserInformation">
              <ul className="myUL">
                  {this.state.userInfo}
              </ul>
              </div>
      </div>
      </div>
    )

  }
  componentWillMount () {
    employee.getNewUsers().then((post: User[]) => {
      //Når AdminPage lastes inn vil alle brukere som ikke har blitt godkjent hentes fra database og presenteres.
      reglist = post
      console.log(reglist)
      this.setState({ // vi lager alle elementene i "nye registrerte" området
        RegisterList: reglist.map((post: User) =>
                          /*Vi oppretter alle linjene i selecten, funksjonen map er basicly en For løkke, den tar for seg hvert element i reglist og oppretter react-elementene under.
                            Anbefales å se console.log av reglist for å se bedre hva som menes.""*/
                          <li id={"Reg" + post.user_id} className="" key={post.first_name}>
                          <a data-tip data-event="click" data-event-off="mouseleave" data-for={"Reg" + post.user_id}>{post.surname}, {post.first_name}</a>
                          {/* ReactTooltip er et modul som lar oss lett lage popup messages på elementer av vårt valg. Ved å bruke data-for i et element kan vi velge å binde en popup til det elementet
                            ved å gi ReactTooltip id=elementets data-for verdi. Inne i <ReactTooltip  /> kan vi designe hvordan vi vil at popuppen skal bli.*/}
                          <ReactTooltip id={"Reg" + post.user_id} aria-haspopup="true">
                              <span> SMILEFJESBIRGER </span>
                          </ReactTooltip>
                          </li>)
      })
    });

    employee.getUnconfirmedCertificates().then((post: User[]) => {
              licenselist = post
              console.log(licenselist)
              this.setState({
                LicenseList: licenselist.map((post) => {
                  let fullname: string = post.first_name + " " + post.surname
                  let surnamefirst: string = post.surname + " " + post.first_name
                  if(fullname.toUpperCase().indexOf(this.refs.LicSearch.value.toUpperCase()) > -1 || surnamefirst.toUpperCase().indexOf(this.refs.LicSearch.value.toUpperCase()) > -1 || post.certificate_name.toUpperCase().indexOf(this.refs.LicSearch.value.toUpperCase()) > -1){
                    {/*   */}
                          return    <li className="" key={post.first_name}>
                                     <a><div className="row"><div className="col-sm-6">{post.surname}, {post.first_name}</div><div className="col-sm-6"> - {post.certificate_name}</div></div></a>
                                     </li>
                   }})
              })
    })
  }

  expandLine(event: Event): void {
    console.log(event)

  }

  contractLine(event: Event): void {
    event.target.style.height = "32px"
  }

  SearchRegFilter(): void {
    let list = this.refs.UsersList.getElementsByTagName("li")
    console.log(list)
        var input, filter, ul, li, a, i;
        input = this.refs.RegSearch
        filter = input.value.toUpperCase();
        ul = this.refs.UsersList
        li = ul.getElementsByTagName('li');
        for (i = 0; i < li.length; i++) {
           a = li[i].getElementsByTagName("a")[0];
           if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
             li[i].style.display = "block";
           } else {
             li[i].style.display = "none";
   }
}
  }

  // SearchLicFilter(): void {// Funksjonen blir kjørt hver gang noen skriver noe i input og sorterer ut elementene som ikke har bokstavene i fornavnet, etternavnet eller i sertifikatnavnet.
    // this.setState({
      // LicenseList: licenselist.map((post: User) => {
              // let fullname: string = post.first_name + " " + post.surname
              // let surnamefirst: string = post.surname + " " + post.first_name
              // if(fullname.toUpperCase().indexOf(this.refs.LicSearch.value.toUpperCase()) > -1 || surnamefirst.toUpperCase().indexOf(this.refs.LicSearch.value.toUpperCase()) > -1 || post.certificate_name.toUpperCase().indexOf(this.refs.LicSearch.value.toUpperCase()) > -1){
              //  Hvis bokstavene matcher, returner elementet til state.
                // return     <li className="" key={post.first_name}>
                           // <a><div className="row"><div className="col-sm-6">{post.surname}, {post.first_name}</div><div className="col-sm-6"> - {post.certificate_name}</div></div></a>
                           // </li>
               // }})
    // })
  // }

   SearchLicFilter(): void {// Funksjonen blir kjørt hver gang noen skriver noe i input og sorterer ut elementene som ikke har bokstavene i fornavnet, etternavnet eller i sertifikatnavnet.
     let list = this.refs.LicenseList.getElementsByTagName("li")
     console.log(list)
         var input, filter, ul, li, a, i;
         input = this.refs.LicSearch
         filter = input.value.toUpperCase();
         ul = this.refs.LicenseList
         li = ul.getElementsByTagName('li');
         for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
              li[i].style.display = "";
              li[i].style.position = ""
            } else {
              li[i].style.display = "none";
              li[i].style.position = "";
            }
          }
        }
}



export { AdminPage }
