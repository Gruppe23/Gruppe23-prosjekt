import { employee } from "./services.js"

export class LoginWindow extends React.Component {
  constructor(){
    super();
  }

  render() {
    return(
            <div className="loginelements">
                <span>Login<p></p></span>
                <input type="text" id="loginMail"></input><p></p>
                <span>Password<p></p></span>
                <input type="password" id="loginPassword"></input><p></p>
                <button ref="login">Login</button>
                <p></p>
                <button onClick={ProgramRenderRef.loadFrontPage}>Load Frontpage</button>
                <p></p>
                <button onClick={VerificationRef.registerWindow}> Til Registrering</button>
            </div>
    );
  }

  componentDidMount() {

    this.refs.login.onclick = () => {
      let login = document.getElementById("loginMail").value
      let pass = document.getElementById("loginPassword").value
      login(login, pass)
  }
  };
}

function login(login, pass) {

    console.log(mail + ' ' + pass)
    employee.getLogin(mail).then((notes) => {
      console.log(notes[0].password);
      if (passwordHash.verify(pass, notes[0].password) == true) {
        alert("password match")
        ProgramRenderRef.loadFrontPage()

      } else {
        alert("password does not match")
      }
  }).catch((error) => {
    console.log('Error getting notes: ' + error);
  });
}
