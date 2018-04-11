// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { employee, User } from '../services';
import { history } from '../forside';

let profilSideRef;
class ProfilSide extends React.Component<{}> {
  constructor(props){
    super(props)
    profilSideRef = this
    this.id = props.match.params.user_id;
    this.state = {ProfileDetails: <ProfileDetails
                                          profil_id={this.id}/>} //Vi sender med if fra parent react class, slik kan vi bruke child react classen i flere forskjellige situasjoner.
  }
  render(){
    return (
      this.state.ProfileDetails
  )
  }
  componentDidMount(){
    profilSideRef = this
  }
}

let profileDetailsRef;
class ProfileDetails extends React.Component<{}> { //React Class som lar oss presentere informasjon om brukere, typ navn, etternavn, adresse, mobilnummer og hvilke roller og kvalifikasjoner de har.
  refs: {name: HTMLDivElement;
          adress: HTMLDivElement;
          email: HTMLDivElement;
          usertype: HTMLDivElement;
          roles: HTMLDivElement;
          qualifications: HTMLDivElement;}

  constructor(props){
    super(props)
    this.state = {Roles: "",
                  Qualifications: "",
                  admin: ""}

    let profil_id = this.props.profil_id //profil_id må inkluderes når react-classen blir referert.
    profileDetailsRef = this
  }

  render() {
return (
    <div>
    <h4><div ref="name"></div></h4><p/>
    <div ref="adress"></div><p/>
    <div ref="email"></div><p/>
    <div ref="usertype"></div><p/>

    <p/>
    {this.state.Qualifications}
    <p/>
    {this.state.Roles}
    <div>
      <p/>

      {this.state.admin}
    </div>
    </div>
  )
  }
  componentDidMount(props){
    this.loadProfileInfo()
    profileDetailsRef = this
  }
  loadProfileInfo(props){
    employee.getSignedInUser().then((user: User) => { // VI henter inn profilen som er signet inn, slik at vi kan sammenligne det med profilsiden vi faktisk er på.
      employee.getUserRoles(this.props.profil_id).then((user_roles) => {
        employee.getUserCertifications(this.props.profil_id).then((user_cert) => {
          employee.getEmployee(this.props.profil_id).then((user_profile) => {
            this.refs.name.textContent =user_profile.first_name + " " + user.surname
            this.refs.adress.textContent ="Adresse: " + user_profile.adress;
            this.refs.email.textContent = "Email: " + user_profile.email;
            if (user_profile.user_type == 1) {
              this.refs.usertype.textContent = "Brukertype: Administrator"
            } else {
              this.refs.usertype.textContent = "Brukertype: Bemanning"
            }
            if (user.user_type == 2){
              this.setState({
                admin: <AdminEditing user_id={user_profile.user_id} />
              })
            } else {
              if (this.props.profil_id == user.user_id){
                this.setState({
                  admin: <UserAdding user_id={user_profile.user_id} />
                })
              }
            }
            this.setState({
                            Roles: user_roles.map((r) => {
                              return <div key={r.role_id}><span>Rolle:</span><span>{r.role_name}</span></div>
                            }),
                            Qualifications: user_cert.map((q) => {
                              return <div key={q.certificate_id}><span>Kvalifikasjoner: </span><span>{q.certificate_name}</span></div>
                            })
            })
            })
        })
      })
    })
  }
}

class UserAdding extends React.Component<{}> {
  refs: {
    certselect: HTMLInputElement;
    addselect: HTMLInputElement;
  }
  constructor(props){
    super()
    this.state = {rolelist: ""}
  }
  render(){
    return(
    <div>
    <button className="TopRight" ref="disableAccount" onClick={()=>{this.disableAccount()}}>x</button>
    <h4><div>Brukerverktøy</div></h4>
    <div>Legge til sertifikater</div>
    <select ref="certselect">
        {this.state.certlist}
    </select>
    <button ref="addselect" onClick= {()=> {this.addQualification()}}>Legg til kompetanse</button>
  </div>
  )
  }

  addQualification(props){
    if (confirm('Er du sikker på at du vil søke om å legge til dette sertifikatet?')) {
      employee.addCertificate(this.props.user_id, this.refs.certselect.value, 0).then((check) => {
        alert(check)
        profileDetailsRef.loadProfileInfo()
      })
} else {
    // Do nothing!
}

  }

    disableAccount(){
      if (confirm('Are you sure you want to deactivate this account?')) {

      } else {
    // Do nothing!
}
  }

  componentDidMount(props){
    employee.getCertificates().then((certs) => {
      employee.getUserCertifications(this.props.user_id).then((user_cert) => {
          this.setState({
                certlist: certs.map((cert) =>{
                    let alreadyExists;
                    for (let x in user_cert){
                      if(user_cert[x].certificate_id == cert.certificate_id){
                        alreadyExists = true
                        break;
                      } else {
                        alreadyExists = false
                      }
                    }
                    if (alreadyExists == true) {
                      //do Nothing
                    } else {
                      return <option value={cert.certificate_id}>{cert.certificate_name}</option>
                    }
                  }
                )
              })
            })
          })


}
}

class AdminEditing extends React.Component<{}> {
  refs: {
    certselect: HTMLInputElement;
    addselect: HTMLInputElement;
  }
  constructor(props){
    super()
    this.state = {rolelist: ""}
  }
  render(){
    return(
    <div>
    <button className="TopRight" ref="disableAccount" onClick={()=>{this.disableAccount()}}>x</button>
    <h4><div>Administratorverktøy</div></h4>
    <div>Legge til sertifikater</div>
    <select ref="certselect">
        {this.state.certlist}
    </select>
    <button ref="addselect" onClick= {()=> {this.addQualification()}}>Legg til kompetanse</button>
  </div>
  )
  }

  addQualification(props){
    if (confirm('Er du sikker på at du vil legge til dette sertifikatet hos brukeren?')) {
      employee.addCertificate(this.props.user_id, this.refs.certselect.value, 1).then((check) => {
        alert(check)
        profileDetailsRef.loadProfileInfo()
      })
} else {
    // Do nothing!
}

  }

    disableAccount(props){
      if (confirm('Are you sure you want to deactivate this account?')) {

      } else {
    // Do nothing!
}
  }

  componentDidMount(props){
    employee.getCertificates().then((certs) => {
      employee.getUserCertifications(this.props.user_id).then((user_cert) => {
          this.setState({
                certlist: certs.map((cert) =>{
                    let alreadyExists;
                    for (let x in user_cert){
                      if(user_cert[x].certificate_id == cert.certificate_id){
                        alreadyExists = true
                        break;
                      } else {
                        alreadyExists = false
                      }
                    }
                    if (alreadyExists == true) {
                    } else {
                      return <option value={cert.certificate_id}>{cert.certificate_name}</option>
                    }
                  }

                )
              })
            })
          })



}
}
export { ProfilSide, ProfileDetails }
