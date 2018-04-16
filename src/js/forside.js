//@ flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, History } from 'react-router-dom';
import { ProfilSide } from "./ForsidePaths/profilewindow.js"
import { Kalender } from "./ForsidePaths/kalender.js"
import { AdminPage } from "./ForsidePaths/Adminpage.js"
import { WelcomePage } from "./ForsidePaths/welcomepage.js"
import { employee } from "./services"
import { programRender, appLogout } from "./app.js"
import {createevents } from "./ForsidePaths/createevents.js"
import { UserSearch } from './ForsidePaths/user_search';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();


if (localStorage.getItem("signedInUser") == true){

}else {
  history.push("/")
}

class Forside2 extends React.Component<{}> {
  constructor() {
    super();
  }

  render(){
    let item: obj = localStorage.getItem('signedInUser')
    if (item != null){
    let userInfo: obj = JSON.parse(item)
    let admin: component;
    let adminpath: reactComponent;
    if(userInfo){
      if(userInfo.user_type == 2){
        admin = <li><Link className="tooltipxx" to='/AdminPage'><span className="tooltiptextxx">Administratorverktøy</span><i className="fa fa-wrench"></i></Link></li>
        adminpath = <Route exact path="/AdminPage" component={AdminPage} />
      } else {
        admin = <span> Velkommen til Røde Kors appen!</span>;
    }
  }
    return(
          <HashRouter>
            <div className="full">
              <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid full">
                  <div className="navbar-header">
                    <a className="navbar-brand">Røde Kors</a>
                  </div>
                  <ul className="nav navbar-nav">
                    <li ><Link className="tooltipxx" to='/forside'><span className="tooltiptextxx">Forside</span><i className="fa fa-home"></i></Link></li>
                    <li><Link className="tooltipxx" to='/kalender'><span className="tooltiptextxx">Kalender</span><i className="fa fa-calendar"></i></Link></li>
                    <li><Link className="tooltipxx"  to={'/profil/' + userInfo.user_id}><span className="tooltiptextxx">Profilside</span><i className="fa fa-user"></i></Link></li>
                    <li><Link className="tooltipxx" to='/profiler'><span className="tooltiptextxx">Brukeroversikt</span><i className="fa fa-users"></i></Link></li>
                    <li><Link className="tooltipxx" to='/opprettevent'><span className="tooltiptextxx">Opprett Arrangement</span><i className="fa fa-calendar-plus-o"></i></Link></li>

                  </ul>
                  <ul className="nav navbar-nav ml-auto">
                    {admin}
                    <li className="logout"><Link className="tooltipxx" ref="/logout" to="/logout"><span className="tooltiptextxx">Log ut</span><i className="fa fa-sign-out"></i></Link></li>
                  </ul>
                </div>
              </nav>
              <div className="forsideContent">
                <Switch>
                  <Route exact path='/forside' component={WelcomePage} />
                  <Route exact path='/profil/:user_id' component={ProfilSide} />
                  <Route exact path='/kalender' component={Kalender} />
                  <Route exact path='/logout' component={Logout} />
                  <Route exact path='/profiler' component={UserSearch} />
                  <Route exact path='/opprettevent' component={createevents} />
                  {adminpath}
                </Switch>
              </div>
            </div>
          </HashRouter>

   )
 }
  }
  componentDidMount(){
    history.push("/forside")
}
}
class Logout extends React.Component<{}> {
  render(){
      return(
        <div> u should not be here </div>
      )
    }
    componentDidMount(){
          employee.signOut()
    }
  }





export { Forside2, history }
