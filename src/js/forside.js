import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, History } from 'react-router-dom';
import { ProfilSide } from "./ForsidePaths/profilewindow.js"
import { Kalender } from "./ForsidePaths/kalender.js"
import { AdminPage } from "./ForsidePaths/Adminpage.js"
import { WelcomePage } from "./ForsidePaths/welcomepage.js"
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();


class Forside2 extends React.Component {
  constructor() {
    super();
  }

  render(){
    let item = localStorage.getItem('signedInUser')
    let userInfo = JSON.parse(item)
    console.log(userInfo)
    let admin;
    let adminpath
    if(userInfo.user_type == 2){
       admin = <li><Link to='/AdminPage'>Admin page</Link></li>
       adminpath = <Route exact path="/AdminPage" component={AdminPage} />
    } else {
      admin = <span> Velkommen til Røde Kors appen!</span>;
    }
    return(

<div className="full">

<span> Hiooo</span>
  <HashRouter>
    <div className="full">
    <nav className="navbar navbar-inverse navbar-fixed-top">
    <div className="container-fluid full">
        <div className="navbar-header">
            <a className="navbar-brand" href="#">WebSiteName</a>
        </div>
        <ul className="nav navbar-nav">
            <li><Link to='/forside'>Home</Link></li>
            <li><Link to='/kalender'>Kalender</Link></li>
            <li><Link to='/profil'>Profil</Link></li>

            {admin}
        </ul>
    </div>
    </nav>
    <div className="forsideContent">
      <Switch>
        <Route exact path='/forside' component={WelcomePage} />
        <Route exact path='/profil' component={ProfilSide} />
        <Route exact path='/kalender' component={Kalender} />
        {adminpath}
      </Switch>
    </div>
  </div>
</HashRouter>
</div>
   )
  }
  componentDidMount(){
    history.push("/forside")
  }
}

function forside2(){
    ReactDOM.render((
        <Forside2 />
  ), document.getElementById('all'));
}

export { Forside2, forside2 }
