import React from 'react';
import ReactDOM from 'react-dom';



class Forside extends React.Component {

  //QUery Personens tillatelse.
  //const Permission = person.permission
  //Skjekke hvilken permission og lage meny ettersom

  render() {
    return (
      <div>
      <div className="overskrift">Velkommen til Forsiden!</div>
      </div>
    )};
  }


  class ForsiderENDER extends React.Component {

    //QUery Personens tillatelse.
    //const Permission = person.permission
    //Skjekke hvilken permission og lage meny ettersom

    render() {
      return (
        <div>
          {folk}
        </div>
      )};
    }


ReactDOM.render((
  <Forside />
), document.getElementById("root"));



function forsideRender(){
ReactDOM:render((
  <ForsiderENDER />
))
}
