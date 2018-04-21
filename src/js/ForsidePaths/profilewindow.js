// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import {Link, HashRouter, Switch, Route} from 'react-router-dom';
import {transporter, nodemailer} from '../app';
import {employee, User} from '../services';
import {history} from '../forside';

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
      admin: ""
    }
    let profil_id = this.props.profil_id //profil_id må inkluderes når react-classen blir referert.
    profileDetailsRef = this
  }
//Elements for profilepage
  render() {
    return (
      <div className="profilside">
        <div className="profilePage">
          <div className="row">
            <div className="col-md-12 pWinUserInfo">
              <h4>
              <div ref="name"></div>
              </h4><p/>
              <div ref="adress"></div><p/>
              <div ref="email"></div><p/>
              <div ref="usertype"></div><p/>
              <p/>
            </div>
          </div>
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
//Info for getting relevant information from user when using profilepage
  loadProfileInfo(props) {
    employee.getSignedInUser().then((user : User) => { // VI henter inn profilen som er signet inn, slik at vi kan sammenligne det med profilsiden vi faktisk er på.
      employee.getUserRoles2(this.props.profil_id).then((user_roles) => {
        employee.getUserCertifications(this.props.profil_id).then((user_cert) => {
          employee.getEmployee(this.props.profil_id).then((user_profile) => {
            this.refs.name.textContent = user_profile.first_name + " " + user_profile.surname
            this.refs.adress.textContent = "Adresse: " + user_profile.adress;
            this.refs.email.textContent = "Email: " + user_profile.email;
            if (user_profile.user_type == 2) {
              this.refs.usertype.textContent = "Brukertype: Administrator"
            } else {
              this.refs.usertype.textContent = "Brukertype: Bemanning"
            }
            if (user.user_type == 2) { // VI velger om brukeren av appen skal kunne se verktøy på profilsiden eller ikke. Er adminbruker pålogget får han mulighet på alles profiler. Er det vanlig bruker er verktøy bare tilgjengelig på egebn profil.
              this.setState({admin: <AdminEditing user_id={user_profile.user_id}/>})
            } else {
              if (this.props.profil_id == user.user_id) {
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
      rolelist: ""
    }
  }
  render() {
    return (<div className="full">
      <h4>
        <div>Brukerverktøy</div>
      </h4>
      <div>Legge til sertifikater</div>
      <select ref="certselect">
        {this.state.certlist}
      </select>
      <button ref="addselect" onClick={ () => {this.addQualification()} }>Legg til kompetanse</button>
    </div>)
  }
//Popup alert for checking info
  addQualification(props) {
    if (confirm('Er du sikker på at du vil søke om å legge til dette sertifikatet?')) {
      employee.addCertificate(this.props.user_id, this.refs.certselect.value, 0).then((check) => {
        alert(check)
        profileDetailsRef.loadProfileInfo()
      })
    } else {
      // Do nothing!
    }
  }

  componentDidMount(props) {
    employee.getUnobtainedUserCertifications(this.props.user_id).then((cert) => {
      this.setState({
        certlist: cert.map((cert) => <option key={cert.certificate_id} value={cert.certificate_id}>{cert.certificate_name}</option>)
      })
    })

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
      rolelist: ""
    }
  }
  render() {
    return (<div>
      <button className="TopRight" ref="disableAccount" onClick={() => {
          this.disableAccount()
        }}>
        <a className="delButton"><i className="fa fa-user-times"></i></a>
      </button>
      <h4>
        <div>Administratorverktøy</div>
      </h4>
      <div>Legge til sertifikater</div>
      <select ref="certselect">
        {this.state.certlist}
      </select>
      <button ref="addselect" onClick={()=> {this.addQualification()}}>Legg til kompetanse</button>
    </div>)
  }
//explains itself
  addQualification(props) {
    if (confirm('Er du sikker på at du vil legge til dette sertifikatet hos brukeren?')) {
      employee.addCertificate(this.props.user_id, this.refs.certselect.value, 1).then((check) => {
        alert(check)
        profileDetailsRef.loadProfileInfo()
      })
    } else {
      // Do nothing!
    }

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
    employee.getUnobtainedUserCertifications(this.props.user_id).then((cert) => {
      this.setState({
        certlist: cert.map((cert) => <option key={cert.certificate_id} value={cert.certificate_id}>{cert.certificate_name}</option>)
      })
    })
  }

}
export {
  ProfilSide,
  ProfileDetails,
  profilSideRef
}
