// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import {Link, HashRouter, Switch, Route} from 'react-router-dom';
import {transporter, nodemailer} from '../app';
import {employee, User} from '../services';
import {history} from '../forside';
import {UserSearch, userSearch} from './user_search';
import onClickOutside from "react-onclickoutside";
import SelectSearch from 'react-select-search'
import {EditUser} from "./AdminPage/editUser"
let selectedCertificate = {name: null, value: null}

let profilSideRef;
class ProfilSide extends React.Component < {} > {
  constructor(props) {
    super(props)
    profilSideRef = this
    this.id = props.match.params.user_id;
    this.state = {
      ProfileDetails: <ProfileDetails profil_id={this.id}/>
    } //Vi sender med if fra parent react class, slik kan vi bruke child react classen i flere forskjellige situasjoner.
  }
  render() {
    return (this.state.ProfileDetails)
  }
  componentDidMount() {
    profilSideRef = this
  }
}

let profileDetailsRef;
class ProfileDetails extends React.Component < {} > { //React Class som lar oss presentere informasjon om brukere, typ navn, etternavn, adresse, mobilnummer og hvilke roller og kvalifikasjoner de har.
  refs: {
    name: HTMLDivElement;
    adress: HTMLDivElement;
    email: HTMLDivElement;
    usertype: HTMLDivElement;
    roles: HTMLDivElement;
    qualifications: HTMLDivElement;
  }

  constructor(props) {
    super(props)
    this.state = {
      Roles: "",
      Qualifications: "",
      admin: "",
      showPopup: false,
    }
    let profil_id = this.props.profil_id //profil_id må inkluderes når react-classen blir referert.
    profileDetailsRef = this
  }
//Elements for profilepage
  render() {
    return (
      <div className="profilside">
        {
          this.state.showPopup
            ? <EditUser user_id={this.props.profil_id} closePopup={this.togglePopup.bind(this) }
            />
            : null
        }
        <div className="profilePage">
          <div className="row">
            <div className="col-md-6 pWinUserInfo">
              <h4>
              <div ref="name"></div>
              </h4>
              <div ref="adress"></div>
              <div ref="zipCode"></div>
              <div ref="phone"></div>
              <p></p>
              <div ref="userid"></div>
              <div ref="email"></div>
              <div ref="usertype"></div>

            </div>
          </div>
          <p></p>
          <div className="row">
            <div className="col-md-6">
              <h4>
                Kvalifikasjoner:
              </h4>
              {this.state.Qualifications}
            </div>
            <div className="col-md-6">
              <h4>
                <p></p>Roller:
              </h4>
              {this.state.Roles}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <p/> {this.state.admin}
            </div>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount(props) {
    this.loadProfileInfo()
    profileDetailsRef = this
  }

  togglePopup(): void {
    /* Funksjonen som slår av/på registreringspopup */
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

//Info for getting relevant information from user when using profilepage
  loadProfileInfo(props) {
    employee.getSignedInUser().then((user : User) => { // VI henter inn profilen som er signet inn, slik at vi kan sammenligne det med profilsiden vi faktisk er på.
      employee.getUserRoles2(this.props.profil_id).then((user_roles) => {
        employee.getUserCertifications(this.props.profil_id).then((user_cert) => {
          employee.getEmployee(this.props.profil_id).then((user_profile) => {
            if(user.user_type == 2) {
              this.refs.adress.textContent = "Adresse: " + user_profile.adress;
              this.refs.zipCode.textContent = "Postnr: " + user_profile.zipcode +" , Sted: " +user_profile.place;
              this.refs.userid.textContent= "Medlemsnummer: " + user_profile.user_id;
            } else if(user.user_id == user_profile.user_id) {
              this.refs.adress.textContent = "Adresse: " + user_profile.adress;
              this.refs.zipCode.textContent = "Postnr: " + user_profile.zipcode +" , Sted: " +user_profile.place;
              this.refs.userid.textContent= "Medlemsnummer: " + user_profile.user_id;
            }
            this.refs.name.textContent = user_profile.first_name + " " + user_profile.surname
            this.refs.phone.textContent = "Mobil: " + user_profile.tlf;
            this.refs.email.textContent = "Email: " + user_profile.email;
            if (user_profile.user_type == 2) {
              this.refs.usertype.textContent = "Brukertype: Administrator"
            } else {
              this.refs.usertype.textContent = "Brukertype: Bemanning"
            }
            if (user.user_type == 2) { // VI velger om brukeren av appen skal kunne se verktøy på profilsiden eller ikke. Er adminbruker pålogget får han mulighet på alles profiler. Er det vanlig bruker er verktøy bare tilgjengelig på egebn profil.
              this.setState({admin: <AdminEditing signedInUser={user.user_id} user_id={user_profile.user_id}/>})
            } else {
              if (user.user_id == user_profile.user_id) {
                this.setState({admin: <UserAdding user_id={user_profile.user_id}/>})
              }
            }
            this.setState({ // Vi legger til roller og kvalifikasjonene profilen har. Alle roller brukeren har godkjente kvalifikasjoner til blir vist og alle kvalifikasjoner blir vist, hvorav de som ikke er godkjente er notert.
              Roles: user_roles.map((r) => {
                return <div key={r.role_id}>
                  <span>{r.role_name}</span>
                </div>
              }),
              Qualifications: user_cert.map((q) => {
                if (q.confirmed == 0) {
                  return <div key={q.certificate_id}>
                    <span>{q.certificate_name}
                      - Ikke godkjent</span>
                  </div>
                } else {
                  return <div key={q.certificate_id}>
                    <span>{q.certificate_name}</span>
                  </div>
                }
              })
            })
          })
        })
      })
    })
  }
}

class UserAdding extends React.Component < {} > {
  // React Class som vises når bruker ser på egen profil. Verktøy tilgjengelig for han lastes inn, bla: muligheten til å søke om flere stipender.
  refs: {
    certselect: HTMLInputElement;
    addselect: HTMLInputElement;
  }
  constructor(props) {
    super()
    this.state = {
      rolelist: "",
      certlist: []
    }
  }
  render() {
    return (<div className="PWuserContent">
      <h4>
        <div>Brukerverktøy</div>
      </h4>
      <div>Legge til sertifikater</div>
      <SelectSearch ref="Usertificate" name="language" options={this.state.certlist} search={true} placeholder="Velg sertifikat"
        mode="input"
        onBlur={(value)=> {selectedCertificate = value}}
        onChange={(value)=> {selectedCertificate = value}}
      />
      <button className="editUserBTN" ref="addselect" onClick={ () => {this.addQualification()} }>Legg til kompetanse</button>
        <button className="editUserBTN" ref="editProfile" onClick={()=>{profileDetailsRef.togglePopup()}}>Endre profil</button>
    </div>)
  }
//Popup alert for checking info
  addQualification(props) {
    if (confirm('Er du sikker på at du vil søke om å legge til dette sertifikatet?')) {
      employee.addCertificate(this.props.user_id, selectedCertificate.value, 0).then((check) => {
        alert(check)
        profileDetailsRef.loadProfileInfo()
        this.loadCertifications()
      })
    } else {
      // Do nothing!
    }
  }

loadCertification(){
  this.state.certlist = []
  employee.getUnobtainedUserCertifications(this.props.user_id).then((cert) => {
    cert.map((cert) => this.state.certlist.push({name: cert.certificate_name, value: cert.certificate_id}))
    this.setState({
      certlist: this.state.certlist
    })
  })
}

  componentDidMount(props) {
    this.loadCertification()
  }
}
//Class for admin options in profilewindow
class AdminEditing extends React.Component < {} > {
  refs: {
    certselect: HTMLInputElement;
    addselect: HTMLInputElement;
  }
  constructor(props) {
    super()
    this.state = {
      rolelist: "",
      certlist: []
    }
  }
  render() {
    let disableButton;
    if(this.props.signedInUser == this.props.user_id) {
      disableButton = "";
    }else{
      disableButton =  <button className="TopRight" ref="disableAccount" onClick={() => {
      this.disableAccount()
    }}>
    <a className="delButton"><i className="fa fa-user-times"></i></a>
    </button>


    };
    return (
      <div className="addsert">
        {disableButton}

      <h4>
        <div>Administratorverktøy</div>
      </h4>
      <div>Legge til sertifikater</div>
      <SelectSearch ref="Asertificate" name="language" options={this.state.certlist} search={true} placeholder="Velg sertifikat"
        mode="input"
        onBlur={(value)=> {selectedCertificate = value}}
        onChange={(value)=> {selectedCertificate = value}}
      />
      <button ref="addselect" className="editUserBTN" onClick={()=> {this.addQualification()}}>Legg til kompetanse</button>
      <button  className="editUserBTN" ref="editProfile" onClick={()=>{profileDetailsRef.togglePopup()}}>Endre profil</button>
    </div>)

  }
//explains itself
  addQualification(props) {
    if (confirm('Er du sikker på at du vil legge til dette sertifikatet hos brukeren?')) {
      employee.addCertificate(this.props.user_id, selectedCertificate.value, 1).then((check) => {
        alert(check)
        profileDetailsRef.loadProfileInfo()
        this.loadCertification()
      })
    } else {
      // Do nothing!
    }
  }

  loadCertification(){
    console.log(this.props.user_id)
    this.state.certlist = []
    employee.getUnobtainedUserCertifications(this.props.user_id).then((cert) => {
      cert.map((x) => this.state.certlist.push({name: x.certificate_name, value: x.certificate_id}))
      this.setState({
        certlist: this.state.certlist
      })
    })
    console.log(this.state.certlist)
  }
//for disableing accont. Popup will appear and ask if you want to delete + mail
  disableAccount(props) {
    if (confirm('Are you sure you want to deactivate this account?')) {
      employee.deactivateAccount(this.props.user_id).then(() => {
        employee.getEmployee(this.props.user_id).then((user) => {
          let api_key = 'key-53691f7229e0eec8522473b2e853cabf';
          let domain = 'sandboxb5cedbd4224a4475ac49059ce199712a.mailgun.org';
          let mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
          let mailMessage = "<p>Hei " + user.first_name + ", din brukerkonto hos Røde Kors bemanningsapplikasjon har blitt deaktivert.</p> Ved eventuelle spørsmål, klager eller tilbakemeldinger vennligst ta kontakt med oss på gruppe23prosjekt@gmail.com<p> Vennlig hilsen oss fra Gruppe 23 teamet.</p> "
          let mailOptions = {
            from: 'Rode Kors <gruppe23prosjekt@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: 'Brukerkonto deaktivert', // Subject line
            html: mailMessage // plain text body
          };



          userSearch.loadUserList()
//Transporter for sending out mail
          mailgun.messages().send(mailOptions, function(error, body) {
            if (error) {
              console.log(error)
            } else {
              console.log(body)
            }
          })
        })
      })
    } else {
      // Do nothing!
    }
  }

  componentDidMount(props) {
this.loadCertification()
  }

}
export {
  ProfilSide,
  ProfileDetails,
  profilSideRef
}
