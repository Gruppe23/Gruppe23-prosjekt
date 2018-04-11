import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { employee, User } from '../services';
import {ProfileDetails} from './profilewindow';
import { history } from '../forside';


class UserSearch extends React.Component<{}> {
  constructor() {
    super()
    this.state = {userlist: "",
                  userinfo: ""}
  }
  render(){
    return(
      <div>
        <div id="UserList">
        <input type="text" className="licSearch" ref="UserSearchInput" onKeyUp={this.UserSearchFilter.bind(this)} placeholder="Søk etter brukere"/>
        <ul ref="UserList" className="myUL">
            {this.state.userlist}
        </ul>
        </div>
      <div className ="">{this.state.userinfo}</div>
    </div>
    )
  }
  componentDidMount(){
    this.loadUserList()
  }

  loadUserList() {
    employee.getSignedInUser().then((signedInUser) => {
    employee.getEmployees().then((users) => {
      this.setState({ // vi lager alle elementene i "nye registrerte" området
        userlist: users.map((user: User) => {
                            if (signedInUser.user_type == 2 || user.status == 1){
                              if (signedInUser.user_type == 2 && user.status == 0){
                                return  <li id={"Reg" + user.user_id} className="red" key={user.first_name} onClick = { () => {this.loadUserInfo(user.user_id)}}>
                                        <a className="red">{user.surname}, {user.first_name}</a>
                                        </li>
                              }else {
                                /*Vi oppretter alle linjene i selecten, funksjonen map er basicly en For løkke, den tar for seg hvert element i reglist og oppretter react-elementene under.
                                  Anbefales å se console.log av reglist for å se bedre hva som menes.""*/
                                  return  <li id={"Reg" + user.user_id} className="" key={user.first_name} onClick = { () => {this.loadUserInfo(user.user_id)}}>
                                          <a>{user.surname}, {user.first_name}</a>
                                          </li>
                              }

                                }
                        })
      })
    });
  })
  }
  loadUserInfo(id){
    employee.getEmployee(id).then((user) => {
      this.setState({userinfo: ""}) //å sette staten på nytt funket ikke slik som det har gjort tidligere. Måtte sette state vekk fra <ProfileDetails/> for at det skulle funke.
      this.setState({userinfo: <ProfileDetails profil_id={user.user_id}/>}) //GJenbruker profilsiden sin profilinformasjon klasse.
    })
  }

  UserSearchFilter(): void {
    //Filtererer listen av nye brukere som har registrert seg etter navn eller etternavn.
    let list = this.refs.UserList.getElementsByTagName("li")
        var input, filter, ul, li, a, i;
        input = this.refs.UserSearchInput
        filter = input.value.toUpperCase();
        ul = this.refs.UserList
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
}

export { UserSearch }
