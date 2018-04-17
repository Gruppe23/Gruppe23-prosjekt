// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { employee } from '../services';
import {  Button, Container, Divider, Dropdown, Header, Message, Segment, Menu, Icon, Sidebar, Tab, Label } from 'semantic-ui-react';
import { EventPopup } from "./eventPopup.js";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))





class Kalender extends React.Component<{}> {
  constructor(props){
    super(props)
    this.state = {
      kalender1: "",
      kalender2: "",
      kalender3: "",
      menuVisible: true,
      showPopup: false,
      firstSlotSelected: false
    }
  }





eventStyleGetter(event, start, end, isSelected) {
    console.log(event);
    var backgroundColor = '#' + event.hexColor;
    var style = {
        backgroundColor: backgroundColor
    };
    if(event.employee_id == null && event.isshift == true && event.interest == null) {
      style.backgroundColor = "#a59e9e"
    } else if (event.employee_id != null || event.interest == 1) {
      if(event.employee_id != null) {
        style.backgroundColor= "#9CEC9C"
      } else if(event.interest == 1){
          style.backgroundColor ="#D3C960"
        }

    }


    if(event.empty_shifts > 0 && event.empty_shifts){
      style.backgroundColor = "#b2262e"
    }
    return {
        style: style
    };
}

  render() {
    let panes = [
  {
    menuItem: { key: 'st_kalender', content: 'Kalender' },
    render: () => <Tab.Pane Loading>{this.state.kalender1}</Tab.Pane>,
  },
  {
    menuItem: <Menu.Item key='passive'>Velg utilgjendelige dager</Menu.Item>,
    render: () => <Tab.Pane Loading>{this.state.kalender2}</Tab.Pane>,
  },
  {
    menuItem: <Menu.Item key='signup'>Vis interesse for arrangementer</Menu.Item>,
    render: () => <Tab.Pane Loading>{this.state.kalender3}</Tab.Pane>,
  },
]
    return(
      <div className="full">
        <div className="full">
           <Tab panes={panes} />
        </div>
        {this.state.showPopup ?
          <EventPopup
            text="Close Me"
            closePopup={this.closePopup.bind(this)}
            />:null
        }
      </div>
    )
  }

  closePopup(){
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  togglePopup(event) {
    new Promise((resolve,reject) =>{
      localStorage.removeItem('event')
      localStorage.setItem('event', JSON.stringify(event))
      console.log(event)
      resolve()
    }).then(()=>{
      this.setState({
        showPopup: !this.state.showPopup
      });
    })
  }

componentWillUnmount(){
  this.setState({
    kalender1: "",
    kalender2: "",
    kalender3: "",
    firstSlotSelected: false
  })
}

  componentDidMount(){
    let eventz;
    let signUpEvents;
    employee.getSignedInUser().then((user) =>{
      console.log("user")
      employee.getEvents().then((EventFetch) => {
        console.log("EventFetch")
        employee.getShifts(user.user_id).then((shifts) => {
          console.log(shifts)
          console.log(user)
          eventz = []
          signUpEvents = []
          console.log(EventFetch)
          let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
            for(let x in shifts){
              signUpEvents.push({interest: shifts[x].interest, isshift: true, id: shifts[x].shift_id, start: shifts[x].start, end: shifts[x].end, employee_id: shifts[x].employee_id, rolle: shifts[x].role_id, title: shifts[x].shift_name, address: shifts[x].address, contact_first_name: shifts[x].contact_first_name, contact_last_name: shifts[x].contact_last_name, contact_tlf: shifts[x].contact_tlf, ext_contact_name: shifts[x].ec_first_name, ec_last_name: shifts[x].ec_last_name, ec_tlf: shifts[x].ec_tlf })
            }
              console.log(shifts)
              if(user.user_type == 2){
                console.log("bigUser")
              for(let x in shifts){
                eventz.push({interest: shifts[x].interest, isshift: true, id: shifts[x].shift_id, start: shifts[x].start, end: shifts[x].end, employee_id: shifts[x].employee_id, rolle: shifts[x].role_id, title: shifts[x].shift_name, address: shifts[x].address, contact_first_name: shifts[x].contact_first_name, contact_last_name: shifts[x].contact_last_name, contact_tlf: shifts[x].contact_tlf, ext_contact_name: shifts[x].ec_first_name, ec_last_name: shifts[x].ec_last_name, ec_tlf: shifts[x].ec_tlf })
            }} else {
              for(let x in shifts){
                if(shifts[x].employee_id == user.user_id){
                  eventz.push({interest: shifts[x].interest, isshift: true, id: shifts[x].shift_id, start: shifts[x].start, end: shifts[x].end, employee_id: shifts[x].employee_id, rolle: shifts[x].role_id, title: shifts[x].shift_name, address: shifts[x].address, contact_first_name: shifts[x].contact_first_name, contact_last_name: shifts[x].contact_last_name, contact_tlf: shifts[x].contact_tlf, ext_contact_name: shifts[x].ec_first_name, ec_last_name: shifts[x].ec_last_name, ec_tlf: shifts[x].ec_tlf })
                }
              }
          }
          for (let x in EventFetch) {
            signUpEvents.push(EventFetch[x])
            eventz.push(EventFetch[x])
          }
            console.log(eventz)
            console.log(signUpEvents)
          console.log('nice for what');
          this.setState({kalender1:
            <BigCalendar
              events={eventz}
              defaultDate={new Date()}
              eventPropGetter={(this.eventStyleGetter)}
              onSelectEvent={event => {this.togglePopup(event)}}
            />
          })

          this.setState({kalender2:
            <BigCalendar
              selectable
              events={eventz}
              defaultDate={new Date()}
              eventPropGetter={(this.eventStyleGetter)}
              onSelectSlot={(
                slotInfo: {
                  start: Date,
                  end: Date,
                  slots: Array<Date>,
                  action: "select" | "click"
                }
                ) => {
                  if(this.state.firstSlotSelected != true) {
                    new Promise((resolve, reject) => {
                    localStorage.setItem('startTime', slotInfo.start)
                    resolve();
                    }).then(() => {
                    this.setState({firstSlotSelected: true})
                    console.log(this.state.firstSlotSelected);
                  })
                } else {
                  new Promise((resolve, reject) => {
                    console.log(this.state.firstSlotSelected);
                    console.log(slotInfo);
                    // employee.setPassive(user.user_id, localStorage.getItem('startTime', slotInfo.end))
                    resolve();
                  }).then(()=>{
                    this.setState({firstSlotSelected: false})
                    localStorage.removeItem('startSlot')
                })
                }
              }}

            />
          })

          this.setState({kalender3:
            <BigCalendar
              events={signUpEvents}
              defaultDate={new Date()}
              eventPropGetter={(this.eventStyleGetter)}
              onSelectEvent={event => {this.togglePopup(event)}}
            />
          })
      })
      })
    })
  }
}

export default Kalender;

export { Kalender }
