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
import { UserSearch } from './ForsidePaths/user_search';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();




class Forside2 extends React.Component<{}> {
  constructor() {
    super();
  }

  render(){
    let item: obj = localStorage.getItem('signedInUser')
    let userInfo: obj = JSON.parse(item)
    let admin: component;
    let adminpath: reactComponent;
    if(userInfo){
      if(userInfo.user_type == 2){
        admin = <li><Link to='/AdminPage'>Admin page</Link></li>
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
                    <li><Link to='/forside'>Home</Link></li>
                    <li><Link to='/kalender'>Kalender</Link></li>
                    <li><Link to={'/profil/' + userInfo.user_id}>Profil</Link></li>
                    <li><Link to='/profiler'>Brukeroversikt</Link></li>
                    <li><Link ref="/logout" to="/logout"> Log ut</Link></li>
                    {admin}

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
                  {adminpath}
                </Switch>
              </div>
            </div>
          </HashRouter>

   )
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
