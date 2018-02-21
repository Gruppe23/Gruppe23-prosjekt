import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component {
  render() {
    return (
    <div>
    <button ref="forsidebutton">
      Forside
    </button>
    <button ref="kalenderbutton">
    kalender
    </button>
    <button ref="Brukeroversikt">
      Brukeroversikt
    </button>
    </div>
    );
  }
    componentDidMount() {
      this.refs.forsidebutton.onclick = () => {

      };
    }

}

ReactDOM.render((
    <Hello />
), document.getElementById('taskbar'));
