// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import {Link, HashRouter, Switch, Route, Redirect} from 'react-router-dom';
import {AdminPageUserCreate} from "./AdminPage/AdminPageUserCreate.js"
import {employee} from "../services"
import {User, userCertificates} from "../services"
import {RegisterWindow} from '../registerwindow';
import ReactTooltip from 'react-tooltip'

let reglist;
let licenselist;
let ClickedLicence: userCertificates;
let ClickedRegister: User;
let AdminPageRef: React$Component < {} >;
let RegisterClick: boolean;

type State = {
  userinfo: React.Component < {} >,
  showPopup: Boolean,
  LicenseList: React.Component < {} >,
  RegisterList: React.Component < {} >,
  UsersList: React.Component < {} >
}
class AdminPage extends React.Component < {} > {
  refs: {
    RegSearch: HTMLInputElement,
    LicSearch: HTMLInputElement,
    LicenseList: HTMLElement,
    UsersList: HTMLElement
  }
  constructor() {
    super()
    AdminPageRef = this
    this.state = {
      userinfo: <div></div>,
      showPopup: false,
      RegisterList: "",
      LicenseList: "",
      userInfo: <UserInfo/>
    }

  }

  togglePopup(): void {
    /* Funksjonen som slår av/på registreringspopup */
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  render() {
    return (<div className="container-fluid AdminPage_Container">
      {
        this.state.showPopup
          ? <AdminPageUserCreate text="Close Me" closePopup={this.togglePopup.bind(this)}/>
          : null
      }

      <div className="input-group-sm hundre" id="AdminPage_LeftBox">
        <button className="btn btn-default" id="Create Profile" onClick={this.togglePopup.bind(this)}>Oprrett Brukerprofil
        </button>
      </div>
      <div id="AdminPage_RightBox" className="grey hundre">
        <span className="centered">Nye registrerte brukere.</span>
        {/* Vi oppretter boksen for å akseptere nye brukere til appen. Vi må bruke state for selecten  fordi det er et element som skal oppdateres dynamisk
          med det vi søker etter.*/
        }

        <div id="AcceptUsersBox">
          <input type="text" className="regSearch" ref="RegSearch" onKeyUp={this.SearchRegFilter.bind(this)} placeholder="Search for names.."/>
          <ul ref="UsersList" className="myUL">
            {this.state.RegisterList}
          </ul>
        </div>
        <span className="centered">Nye kvalifikasjoner trenger godkjenning</span>
        {/* Vi gjør det samme med LicenseBox */}

        <div id="AcceptLicenseBox">
          <input type="text" className="licSearch" ref="LicSearch" onKeyUp={this.SearchLicFilter.bind(this)} placeholder="Search for names or licenses"/>
          <ul ref="LicenseList" className="myUL">
            {this.state.LicenseList}
          </ul>
        </div>

        <div id="UserInfoBox">
          <ul className="myUL">
            {this.state.userInfo}
          </ul>
        </div>

      </div>
    </div>)

  }
  loadRegisterList() {
    employee.getNewUsers().then((post) => {
      //Når AdminPage lastes inn vil alle brukere som ikke har blitt godkjent hentes fra database og presenteres i en søkbar liste.
      reglist = post
      this.setState({ // vi lager alle elementene i "nye registrerte" området
        RegisterList: reglist.map((post : User) =>
        /*Vi oppretter alle linjene i selecten, funksjonen map er basicly en For løkke, den tar for seg hvert element i reglist og oppretter react-elementene under.
                            Anbefales å se console.log av reglist for å se bedre hva som menes.""*/
        <li id={"Reg" + post.user_id} className="" key={post.first_name} onClick={ () => {this.RegisterUpdateUserInfoBox(post, event)}}>
          <a>{post.surname}, {post.first_name}</a>
        </li>)
      })
    });
  }

  loadLicenseList() {
    employee.getUnconfirmedCertificates().then((post) => {
      //Vi rendrer alle lisensene som folk har søkt om å få godkjent.
      // alle listelementene rendres en gang og blir visuelt sortert med display = "none" i søkefunksjonen under. @SearchLicFilter/RegFilter
      licenselist = post
      this.setState({
        LicenseList: licenselist.map((post) => {
          return <li className="" key={post.first_name + post.certificate_id} onClick={ () => {this.CertificateUpdateUserInfoBox(post, event)}}>
            <a>
              <div className="row">
                <div className="col-sm-6">{post.surname}, {post.first_name}</div>
                <div className="col-sm-6">
                  - {post.certificate_name}</div>
              </div>
            </a>
          </li>
        })
      })
    })
  }
  // componentWillUnmount(){ Forhindrer memoryleak ved å fjerne lister som oppddaterer seg asynkront med siden.
  //   this.setState({
  //
  // }
  componentWillMount() {
    this.loadRegisterList()
    this.loadLicenseList()

  }

  SearchRegFilter(): void {
    //Filtererer listen av nye brukere som har registrert seg etter navn eller etternavn.
    let list = this.refs.UsersList.getElementsByTagName("li")
      var input,
        filter,
        ul,
        li,
        a,
        i;
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

    SearchLicFilter(): void {
      //* Funksjonen blir kjørt hver gang noen skriver noe i input og sorterer ut elementene som ikke har
      //bokstavene i fornavnet, etternavnet eller i sertifikatnavnet. */
      let list = this.refs.LicenseList.getElementsByTagName("li")
        var input,
          filter,
          ul,
          li,
          a,
          i;
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

      CertificateUpdateUserInfoBox(object : userCertificates, event) {
        // Oppdaterer informasjonen i UserInfoBOx ved trykk på ny sertifikatsøknad i lista.
        userInfoRef.refs.UIBName.textContent = "Navn: " + object.first_name + " " + object.surname;
        userInfoRef.refs.UIBUsername.textContent = "Brukernavn: " + object.username;
        userInfoRef.refs.UIBEmail.textContent = "Email: " + object.email;
        userInfoRef.refs.UIBAdress.textContent = "Adresse: " + object.adress;
        userInfoRef.refs.UIBCertificate.textContent = "Sertifikatnavn: " + object.certificate_name + ", Sertifikatid: " + object.certificate_id;
        userInfoRef.refs.UIBCertificate.style.display = ""
        RegisterClick = false;
        ClickedLicence = object;
        console.log(object)
      }

      RegisterUpdateUserInfoBox(object : User, event) {
        //Oppdaterer informasjonen i UserInfoBox ved trykk på en ny bruker i lista.
        userInfoRef.refs.UIBName.textContent = "Navn: " + object.first_name + " " + object.surname;
        userInfoRef.refs.UIBUsername.textContent = "Brukernavn: " + object.username;
        userInfoRef.refs.UIBEmail.textContent = "Email: " + object.email;
        userInfoRef.refs.UIBAdress.textContent = "Adresse: " + object.adress;
        userInfoRef.refs.UIBCertificate.textContent = ""
        userInfoRef.refs.UIBCertificate.style.display = "none"
        ClickedRegister = object;
        RegisterClick = true;
        console.log(object)
      }
    }

    let userInfoRef;
    class UserInfo extends React.Component < {} > {
      //Boksen der informasjon om valgte nye brukere eller nye sertifikatsøknader.
      refs: {
        UIBUsername: HTMLDivElement;
        UIBCertificate: HTMLDivElement;
        UIBName: HTMLDivElement;
        UIBEmail: HTMLDivElement;
        UIBAdress: HTMLDivElement;
        AcceptBTN: HTMLInputElement;
        DeclineBTN: HTMLInputElement;
      }
      constructor() {
        super();
        userInfoRef = this
      }
      render() {
        return (<div>
          <div ref="UIBUsername">Informasjon om valgte brukere som har registrert seg eller lagt inn nye sertifikater til godkjenning vises her. For å velge trykk på tilgjengelige alternativer i boksene over.</div>
          <div ref="UIBCertificate"></div>
          <div ref="UIBName"></div>
          <div ref="UIBEmail"></div>
          <div ref="UIBAdress"></div>
          <div id="UserInfoBoxBTNS">
            <button ref="AcceptBTN">Aksepter</button>
            <button ref="DeclineBTN>">Avvis</button>
          </div>
        </div>
        ) } componentDidMount(){
          this.refs.AcceptBTN.onclick = () => {
            //OnClicken for å akseptere bruker eller sertifikat som er valgt. Oppdaterer tabellen i MySQL og oppdaterer listen som vises.
            if (RegisterClick == true) { //Skjekker om det er et sertifikat eller brukerkonto som er til revidering i info-boksen
              employee.acceptNewUser(ClickedRegister.user_id).then(() => {
                AdminPageRef.loadRegisterList()
                ClickedRegister = ""
              })
            } else {
              console.log(ClickedLicence)
              employee.acceptCertificate(ClickedLicence.user_id, ClickedLicence.certificate_id).then(() => {
                AdminPageRef.loadLicenseList();
                ClickedLicence = ''
              })
            }

          }
          // this.refs.DeclineBTN.onclick = () => {
          //
          // }
        }
        } export {AdminPage}
