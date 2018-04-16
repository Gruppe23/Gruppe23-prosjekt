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
      menuVisible: true,
      showPopup: false,
      firstSlotSelected: false
    }
  }





eventStyleGetter(event, start, end, isSelected) {
    console.log(event);
    var backgroundColor = '#' + event.hexColor;
    var style = {
        backgroundColor: backgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'red',
        border: '0px',
        display: 'block'
    };
    if(event.employee_id == null && event.isshift == 1) {
      style.backgroundColor = "#E679E3"
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
      resolve()
    }).then(()=>{
      this.setState({
        showPopup: !this.state.showPopup
      });
    })
  }

  componentDidMount(){
    employee.getSignedInUser2().then((user) =>{
      employee.getEvents().then((EventFetch) => {
        employee.getShifts(user.user_id).then((shifts) => {
          console.log(EventFetch)
          let events = EventFetch
          let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
          new Promise((resolve, reject)=> {
              for(let x in shifts){events.push({isshift: 1, id: shifts[x].event_id, start: shifts[x].start, end: shifts[x].end, employee_id: shifts[x].employee_id, rolle: shifts[x].role_id,title: shifts[x].shift_name })
              console.log(events)
            }
              resolve(events)
          }).then((eventz)=> {
          console.log('nice for what');
          this.setState({kalender1:
            <BigCalendar
              questionmark = {console.log(eventz)}
              events={eventz}
              views={allViews}
              step={60}
              showMultiDayTimes
              defaultDate={new Date()}
              eventPropGetter={(this.eventStyleGetter)}
              onSelectEvent={event => {this.togglePopup(event)}}
            />
          })

          this.setState({kalender2:
            <BigCalendar
              selectable
              events={events}
              views={allViews}
              step={60}
              showMultiDayTimes
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
        })
      })
      })
    })
  }
}

export default Kalender;

export { Kalender }
