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
const remote = require('electron').remote;




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
        admin = <ul className="nav navbar-nav"><li><Link className="tooltipxx" to='/AdminPage'><span className="tooltiptextxx">Administratorverktøy</span><i className="fa fa-wrench"></i></Link></li><li><Link className="tooltipxx" to='/opprettevent'><span className="tooltiptextxx">Opprett Arrangement</span><i className="fa fa-calendar-plus"></i></Link></li></ul>
        adminpath = <Route exact path="/AdminPage" component={AdminPage} />
      } else {
        admin = <span> Velkommen til Røde Kors appen!</span>;
    }
  }
    return(
          <HashRouter>
            <div className="full">
              <nav className="navbar navbar-inverse navbar-fixed-top drag">
                <div className="container-fluid full">
                  <div className="navbar-header">
                    <img className="RCIcon" src="src\pictures\Red_Cross.png"/>
                  </div>
                  <ul className="nav navbar-nav">
                    <li tabIndex="-1" className="noOutline" ><Link className="tooltipxx" to='/forside'><span className="tooltiptextxx">Forside</span><i className="fa fa-home"></i></Link></li>
                    <li><Link className="tooltipxx" to='/kalender'><span className="tooltiptextxx">Kalender</span><i className="fa fa-calendar-alt"></i></Link></li>
                    <li><Link className="tooltipxx"  to={'/profil/' + userInfo.user_id}><span className="tooltiptextxx">Profilside</span><i className="fa fa-user"></i></Link></li>
                    <li><Link className="tooltipxx" to='/profiler'><span className="tooltiptextxx">Brukeroversikt</span><i className="fa fa-users"></i></Link></li>
                  </ul>
                  {admin}
<ul className="nav floatRight navbar-nav">
                  <li className="logout"><Link className="tooltipxx" ref="/logout" to="/logout"><span className="tooltiptextxx">Log ut</span><i className="fa fa-sign-out-alt"></i></Link></li>
                    <li id="Minimize" className="tooltipxx"><a><i className="fa fa-window-minimize"></i></a></li>
                      <li id="Maximize" className="tooltipxx"><a><i className="fa fa-window-maximize"></i></a></li>
                        <li id="Close" className="tooltipxx"><a><i className="fa fa-window-close"></i></a></li>
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
    document.getElementById("Minimize").addEventListener("click", function (e) {
      const window = remote.getCurrentWindow();
      window.minimize();
    })

    document.getElementById("Maximize").addEventListener("click", function (e) {
      const window = remote.getCurrentWindow();
      window.maximize();
    })

    document.getElementById("Close").addEventListener("click", function (e) {
      const window = remote.getCurrentWindow();
      window.close();
    })
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
