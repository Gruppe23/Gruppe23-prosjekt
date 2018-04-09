// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import {employee} from '../services';

class ProfilSide extends React.Component<{}> {
  constructor(){
    super()
    this.state = {ProfileDetails: <ProfileDetails />}
  }
  render(){
    return (
      this.state.ProfileDetails
  )
  }

}


class ProfileDetails extends React.Component<{}> {
  refs: {name: HTMLDivElement;
          adress: HTMLDivElement;
          email: HTMLDivElement;
          usertype: HTMLDivElement;
          roles: HTMLDivElement;
          qualifications: HTMLDivElement;}

  constructor(){
    super()
    this.state = {Roles: "",
                  Qualifications: ""}
  }

  render() {
return (
    <div>
    <h3><div ref="name"></div></h3><p/>
    <div ref="adress"></div><p/>
    <div ref="email"></div><p/>
    <div ref="usertype"></div><p/>
    {this.state.Qualifications}
    <p/>
    {this.state.Roles}
    </div>
  )
  }

  componentDidMount(){
    employee.getSignedInUser().then((user) => {
      employee.getUserRoles(user.user_id).then((user_roles) => {
        employee.getUserCertifications(user.user_id).then((user_cert) => {
          console.log(user_cert);
          this.refs.name.textContent = "Navn: " + user.first_name + " " + user.surname
          this.refs.adress.textContent ="Adresse: " + user.adress;
          this.refs.email.textContent = "Email: " + user.email;
          if (user.user_type = 1) {
            this.refs.usertype.textContent = "Brukertype: Administrator"
          } else {
            this.refs.usertype.textContent = "Brukertype: Bemanning"
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
  }
}
export { ProfilSide }
