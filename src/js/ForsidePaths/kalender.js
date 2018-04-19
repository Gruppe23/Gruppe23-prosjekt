// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { employee } from '../services';
import {  Button, Container, Divider, Dropdown, Header, Message, Segment, Menu, Icon, Sidebar, Tab, Label } from 'semantic-ui-react';
import { EventPopup } from "./eventPopup.js";
import SelectSearch from 'react-select-search'
import onClickOutside from "react-onclickoutside";
import {ShiftCreatePopup} from "./shiftCreatePopup.js"
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))




let kalender;
export class Kalender extends React.Component<{}> {


  constructor(props){
    super(props);
    kalender=this;
    this.state = {
      kalender1: "",
      kalender2: "",
      kalender3: "",
      menuVisible: true,
      showPopup: false,
      showShiftCreation: false,
      firstSlotSelected: false,
      createShiftInfo: "",
    }
    kalender = this;
  }





eventStyleGetter(event, start, end, isSelected) {
let user = employee.getSignedInUser2()

    var backgroundColor = '#' + event.hexColor;
    var style = {
        backgroundColor: backgroundColor
    };

    if(event.ispassive){
      style.backgroundColor= '#696969'
    }else{
   if(event.employee_id == null && event.isshift == true && event.interest == null) {
      style.backgroundColor = "#a59e9e"
    } else if (event.employee_id != null || event.interest == 1) {
      if(event.employee_id != null) {
        if(event.employee_id == user.user_id){
          style.backgroundColor= "#00ce00"
        } else {
          if (user.user_type == 2){
            style.backgroundColor = "#00ce00"
          }else{
            style.backgroundColor = "black"
          }
        }
      } else if(event.interest == 1){
          style.backgroundColor ="#D3C960"
        }
    }
      if(event.empty_shifts > 0 && event.empty_shifts){
        if(user.user_type == 2 && event.empty_shifts > 0) {
          style.backgroundColor = "#b2262e"
        }
      }
    }
    return {
        style: style
    };
}

  render() {

    let user = employee.getSignedInUser2()
    let panes
    if (user.user_type == 2) {
      panes = [
    {
      menuItem: { key: 'st_kalender', content: 'Kalender' },
      render: () => <Tab.Pane Loading>{this.state.kalender1}</Tab.Pane>,
    },
    {
      menuItem: <Menu.Item key='passive'>Velg utilgjendelige dager</Menu.Item>,
      render: () => <Tab.Pane Loading>{this.state.kalender2}</Tab.Pane>,
    },
    {
      menuItem: <Menu.Item key='opprettSkift'>Opprett Skift</Menu.Item>,
      render: () => <Tab.Pane Loading>{this.state.kalender3}</Tab.Pane>,
    }
  ]
    }else {
      panes = [
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
    }

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
        {
          this.state.showShiftCreation
            ? <ShiftCreatePopup text="Close Me" info={this.state.createShiftInfo} closePopup={this.toggleShiftCreation.bind(this)}
        />
            : null
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

  closeShiftCreation(slotInfo, event){
    this.setState({
      showShiftCreation: !this.state.showShiftCreation
    });
  }

  toggleShiftCreation(slotInfo) {
    new Promise((resolve,reject) =>{
      console.log(slotInfo)
      resolve()
    }).then(()=>{
      this.setState({
        showShiftCreation: !this.state.showShiftCreation,
        createShiftInfo: slotInfo,
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

  RenderCalendar(){
    let eventz;
    let signUpEvents;
    employee.getSignedInUser().then((user) =>{
      employee.getEvents().then((EventFetch) => {
      employee.getUserPassiveDays(user.user_id).then((passiveDays)=>{
        console.log(passiveDays)
        employee.getShifts(user.user_id).then((shifts) => {
          employee.getShiftsMatchingUserRoles(user.user_id).then((matchedShifts)=> {
            console.log(matchedShifts)

          eventz = []
          signUpEvents = []
          let passiveEvents = []

          let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
          //Setter opp hvilke eventer brukeren kan vise interesse i basert på hvilke roller de har. Hvis de er admin kan de se alle eventer.
            for(let x in matchedShifts){
              signUpEvents.push({interest: matchedShifts[x].interest, isshift: true, id: matchedShifts[x].shift_id, start: matchedShifts[x].start, end: matchedShifts[x].end, employee_id: matchedShifts[x].employee_id, rolle: matchedShifts[x].role_id, title: matchedShifts[x].shift_name, address: matchedShifts[x].address, contact_first_name: matchedShifts[x].contact_first_name, contact_last_name: matchedShifts[x].contact_last_name, contact_tlf: matchedShifts[x].contact_tlf, ext_contact_name: matchedShifts[x].ec_first_name, ec_last_name: matchedShifts[x].ec_last_name, ec_tlf: matchedShifts[x].ec_tlf })
            }
            //Setter opp eventvariablen for kalenderen som viser passive dagene til brukeren.
            for(let x in passiveDays){
              passiveEvents.push({ispassive: true, passiveId:passiveDays[x].passive_id, id:passiveDays[x].employee_id, title: passiveDays[x].title, start: passiveDays[x].from_date, end: passiveDays[x].to_date})
            }

              if(user.user_type == 2){
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
            passiveEvents.push(EventFetch[x])
          }
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
                  events={passiveEvents}
                  defaultDate={new Date()}
                  onEventDrop={console.log("lul")}
                  eventPropGetter={(this.eventStyleGetter)}
                  onSelectEvent={
                    event => {
                    if(event.ispassive){

                      let c = confirm('Are you sure you wish to remove this passive event?')
                      if(c == true){
                        employee.removePassiveEvent(event.passiveId)
                        this.RenderCalendar();
                      }
                    }else{
                      this.togglePopup(event)
                    }
                  }
                  }
                  onSelectSlot={(
                    slotInfo: {
                      start: Date,
                      end: Date,
                      slots: Array<Date>,
                      action: "select" | "click"
                    }
                    ) => {
                      new Promise((resolve, reject) => {
                        console.log(slotInfo)
                        if(slotInfo.end == slotInfo.start) {
                          slotInfo.end.setHours(23:59)
                          slotInfo.start.setHours(0)
                          resolve(true)
                        }else {

                        if((slotInfo.end.getDate() - slotInfo.start.getDate()) < 1) {
                          if((slotInfo.end.getHours() - slotInfo.start.getHours()) < 12){
                            alert("Du må sette opp en passiv event på over 12 timer for at den skal opprettes.")
                          }else {
                            resolve(false);
                          }
                        } else {
                          resolve(false);
                        }
                      }
                    }).then((x)=> {
                        if(x == false) {
                        slotInfo.end.setHours(slotInfo.end.getHours() + 1)
                      }
                        let c = confirm('Valgt tidsramme er fra \n' +slotInfo.start+ '\nTil \n'+ slotInfo.end+ '\nØnsker du å sette deg opp som utilgjengelig disse dagene?')
                        if(c == true){
                          employee.setPassive(user.user_id, slotInfo.start, slotInfo.end )
                        }
                        this.RenderCalendar();
                      })

                    }
                  }
                />
              })
              if(user.user_type == 2){
                this.setState({kalender3:
                  <BigCalendar
                  selectable
                    events={signUpEvents}
                    defaultDate={new Date()}
                    eventPropGetter={(this.eventStyleGetter)}
                    onSelectSlot={(
                      slotInfo: {
                        start: Date,
                        end: Date,
                        slots: Array<Date>,
                        action: "select" | "click"
                      }
                    ) => {this.toggleShiftCreation(slotInfo)}}
                  />
                })
              } else {
                this.setState({kalender3:
                  <BigCalendar
                  selectable
                  events={signUpEvents}
                  defaultDate={new Date()}
                  eventPropGetter={(this.eventStyleGetter)}
                  onSelectEvent={event => {this.togglePopup(event)}}

                  />
                })
              }
        })
      })
    })
  })
})
}




  componentDidMount(){
    this.RenderCalendar();
  }
}



export { kalender }
